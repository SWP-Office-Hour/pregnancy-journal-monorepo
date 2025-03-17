import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

interface Article {
  id: number;
  title: string;
  imageUrl: string;
  date: Date;
  comments: number;
}

@Component({
  selector: 'app-recommended-blogs',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './recommended-blogs.component.html',
  styleUrl: './recommended-blogs.component.css',
})
export class RecommendedBlogsComponent implements OnInit {
  mainArticle: Article = {
    id: 1,
    title: 'The Future of Web Development: Trends to Watch in 2024',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    date: new Date('2024-01-15'),
    comments: 156,
  };

  secondaryArticles: Article[] = [
    {
      id: 2,
      title: '10 Essential Tips for Modern UI Design That Everyone Should Know',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      date: new Date('2024-01-14'),
      comments: 84,
    },
    {
      id: 3,
      title: 'Building Scalable Applications with Angular and TypeScript',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      date: new Date('2024-01-13'),
      comments: 92,
    },
    {
      id: 4,
      title: 'The Complete Guide to Responsive Web Design in 2024',
      imageUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5',
      date: new Date('2024-01-12'),
      comments: 127,
    },
  ];

  ngOnInit(): void {
    // Initialize any required data or services
  }
}
