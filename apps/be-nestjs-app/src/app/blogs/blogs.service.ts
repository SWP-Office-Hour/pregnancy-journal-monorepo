import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCreateRequest, BlogResponse, BlogUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BlogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBlogDto: BlogCreateRequest) {
    const category = await this.databaseService.Category.findUnique({
      where: {
        category_id: createBlogDto.category_id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const blog = await this.databaseService.Blog.create({
      data: {
        title: createBlogDto.title,
        content: createBlogDto.content_url,
        author: createBlogDto.author,
        summary: createBlogDto.summary,
        created_at: new Date(),
        updated_at: new Date(),
        category: {
          connect: {
            category_id: createBlogDto.category_id,
          },
        },
      },
    });

    if (createBlogDto.tags_id) {
      for (const tag_id of createBlogDto.tags_id) {
        const tag = await this.databaseService.Tag.findUnique({
          where: {
            tag_id: tag_id,
          },
        });

        if (!tag) {
          throw new NotFoundException('Tag not found');
        }
      }

      await this.databaseService.BlogOnTag.createMany({
        data: createBlogDto.tags_id
          .filter((tag_id) => tag_id !== undefined)
          .map((tag_id) => ({
            blog_id: blog.blog_id,
            tag_id: tag_id as string,
          })),
      });
    }

    return blog;
  }

  async findAll(page: number, limit: number) {
    const result = await this.databaseService.Blog.findMany({
      skip: page == 0 ? page : (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        blog_tag: {
          include: {
            tag: true,
          },
        },
      },
    });

    const total_page = Math.ceil((await this.databaseService.Blog.count()) / limit);

    const blogs = result.map((blog) => ({
      id: blog.blog_id,
      title: blog.title,
      author: blog.author,
      content_url: blog.content,
      create_at: blog.created_at,
      category: {
        status: blog.category.status,
        title: blog.category.title,
        category_id: blog.category.category_id,
      },
      tags: blog.blog_tag.map((item) => ({
        title: item.tag.title,
        tag_id: item.tag.tag_i,
      })),
      summary: blog.summary,
    }));

    return { blogs, total_page };
  }

  async findOne(id: string): Promise<BlogResponse> {
    const result = await this.databaseService.Blog.findUnique({
      where: {
        blog_id: id,
      },
      include: {
        blog_tag: {
          include: {
            tag: true,
          },
        },
        category: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Blog not found');
    }

    const tags = result.blog_tag.map((item) => item.tag);

    return {
      id: result.blog_id,
      title: result.title,
      content_url: result.content,
      author: result.author,
      summary: result.summary,
      create_at: result.created_at,
      category: result.category,
      tags: tags,
    };
  }

  async update(updateBlogDto: BlogUpdateRequest) {
    const cur = await this.databaseService.Blog.findUnique({
      where: {
        blog_id: updateBlogDto.id,
      },
    });
    const tags = updateBlogDto.tags_id;
    updateBlogDto.tags_id = undefined;
    if (!cur) {
      throw new NotFoundException('Blog not found');
    }
    await this.databaseService.Blog.update({
      where: {
        blog_id: updateBlogDto.i,
      },
      data: {
        ...updateBlogDto,
      },
    });

    if (tags) {
      for (const tag_id of tags) {
        const tag = await this.databaseService.Tag.findUnique({
          where: {
            tag_id: tag_id,
          },
        });

        if (!tag) {
          throw new NotFoundException('Tag not found');
        }
      }

      await this.databaseService.BlogOnTag.deleteMany({
        where: {
          blog_id: updateBlogDto.id,
        },
      });

      await this.databaseService.BlogOnTag.createMany({
        data: tags
          .filter((tag_id) => tag_id !== undefined)
          .map((tag_id) => ({
            blog_id: updateBlogDto.id,
            tag_id: tag_id,
          })),
      });
    }

    return this.findOne(updateBlogDto.id);
  }

  async remove(id: string) {
    const cur = await this.findOne(id);
    if (!cur) {
      throw new NotFoundException('Blog not found');
    }
    await this.databaseService.BlogOnTag.deleteMany({
      where: {
        blog_id: id,
      },
    });

    return this.databaseService.Blog.delete({
      where: {
        blog_id: id,
      },
    });
  }
}
