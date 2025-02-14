import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCreateRequest, BlogResponse, BlogUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BlogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBlogDto: BlogCreateRequest) {
    const category = await this.databaseService.Category.findUnique({
      where: {
        id: createBlogDto.category_id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const blog = await this.databaseService.Blog.create({
      data: {
        title: createBlogDto.title,
        content_url: createBlogDto.content_url,
        author: createBlogDto.author,
        summary: createBlogDto.summary,
        created_at: new Date(),
        updated_at: new Date(),
        category: {
          connect: {
            id: createBlogDto.category_id,
          },
        },
      },
    });

    if (createBlogDto.tags_id) {
      await this.databaseService.BlogOnTag.createMany({
        data: createBlogDto.tags_id.map((tag_id) => ({
          blog_id: blog.id,
          tag_id,
        })),
      });
    }

    return blog;
  }

  async findAll(page: number, limit: number) {
    const result = await this.databaseService.Blog.findMany({
      skip: page == 0 ? page - 0 : (page - 1) * limit,
      take: limit - 0,
      include: {
        category: true,
        blog_tag: {
          select: {
            tag: true,
          },
        },
      },
    });

    const blogsWithTags = result.map((blog) => ({
      ...blog,
      tags: blog.blog_tag.map((blogTag) => blogTag.tag),
      blog_tag: undefined, // Remove the blog_tag field
    }));
    const count = await this.databaseService.Blog.count();
    return {
      blogs: blogsWithTags,
      total_page: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<BlogResponse> {
    const result = await this.databaseService.Blog.findUnique({
      where: {
        id: id,
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
      id: result.id,
      title: result.title,
      content_url: result.content_url,
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
        id: updateBlogDto.id,
      },
    });
    const tags = updateBlogDto.tags_id;
    updateBlogDto.tags_id = undefined;
    if (!cur) {
      throw new NotFoundException('Blog not found');
    }
    await this.databaseService.Blog.update({
      where: {
        id: updateBlogDto.id,
      },
      data: {
        ...updateBlogDto,
      },
    });

    if (tags) {
      await this.databaseService.BlogOnTag.deleteMany({
        where: {
          blog_id: updateBlogDto.id,
        },
      });

      await this.databaseService.BlogOnTag.createMany({
        data: tags.map((tag_id) => ({
          blog_id: updateBlogDto.id,
          tag_id,
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
        id: id,
      },
    });
  }
}
