import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCreateRequestType, BlogResponseType, BlogUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BlogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBlogDto: BlogCreateRequestType) {
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
        content: createBlogDto.content,
        author: createBlogDto.author,
        summary: createBlogDto.summary,
        created_at: new Date(),
        updated_at: new Date(),
        blog_cover: createBlogDto.blog_cover,
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

  async findAll(page: number, limit: number): Promise<{ blogs: BlogResponseType[]; total_page: number }> {
    const result = await this.databaseService.Blog.findMany({
      skip: page == 0 ? Number(page) : (page - 1) * limit,
      take: Number(limit),
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
      blog_id: blog.blog_id,
      title: blog.title,
      author: blog.author,
      content: blog.content,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
      blog_cover: blog.blog_cover,
      category: {
        status: blog.category.status,
        title: blog.category.title,
        category_id: blog.category.category_id,
      },
      tags: blog.blog_tag.map((item) => ({
        title: item.tag.title,
        tag_id: item.tag.tag_id,
        status: item.tag.status,
      })),
      summary: blog.summary,
    }));

    return { blogs, total_page };
  }

  async findOne(id: string): Promise<BlogResponseType> {
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
      blog_id: result.blog_id,
      title: result.title,
      content: result.content,
      author: result.author,
      summary: result.summary,
      created_at: result.created_at,
      updated_at: result.updated_at,
      blog_cover: result.blog_cover,
      category: result.category,
      tags: tags,
    };
  }

  async update(updateBlogDto: BlogUpdateRequestType) {
    const cur = await this.databaseService.Blog.findUnique({
      where: {
        blog_id: updateBlogDto.blog_id,
      },
    });
    const tags = updateBlogDto.tags_id;
    updateBlogDto.tags_id = undefined;
    if (!cur) {
      throw new NotFoundException('Blog not found');
    }
    await this.databaseService.Blog.update({
      where: {
        blog_id: updateBlogDto.blog_id,
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
          blog_id: updateBlogDto.blog_id,
        },
      });

      await this.databaseService.BlogOnTag.createMany({
        data: tags
          .filter((tag_id) => tag_id !== undefined)
          .map((tag_id) => ({
            blog_id: updateBlogDto.blog_id,
            tag_id: tag_id,
          })),
      });
    }

    return this.findOne(updateBlogDto.blog_id);
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
