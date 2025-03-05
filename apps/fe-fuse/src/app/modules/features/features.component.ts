import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class FeaturesComponent implements OnInit {
  // Feature sections
  featureSections = [
    {
      id: 'tracking',
      title: 'Theo dõi thai kỳ',
      description: 'Theo dõi từng khoảnh khắc trong hành trình của bạn với các công cụ theo dõi thai kỳ toàn diện.',
      features: [
        {
          title: 'Cập nhật phát triển hàng tuần',
          description: 'Nhận thông tin chi tiết về sự phát triển của em bé mỗi tuần.',
          icon: 'M9 12.75L11.25 15L15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
        },
        {
          title: 'Lịch trình cá nhân hóa',
          description: 'Hành trình thai kỳ độc đáo của bạn với các cột mốc và sự kiện được tùy chỉnh.',
          icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
        },
      ],
    },
    {
      id: 'health',
      title: 'Giám sát sức khỏe',
      description: 'Theo dõi sức khỏe và sự khỏe mạnh của bạn trong suốt thai kỳ.',
      features: [
        {
          title: 'Theo dõi triệu chứng',
          description: 'Ghi lại và theo dõi các triệu chứng thai kỳ để chia sẻ với bác sĩ của bạn.',
          icon: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75',
        },
        {
          title: 'Cân nặng & Dinh dưỡng',
          description: 'Theo dõi sự thay đổi cân nặng và duy trì dinh dưỡng cân bằng trong suốt thai kỳ.',
          icon: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z',
        },
      ],
    },
    {
      id: 'journal',
      title: 'Nhật ký thai kỳ',
      description: 'Ghi lại mọi khoảnh khắc đặc biệt với các công cụ ghi nhật ký toàn diện của chúng tôi.',
      features: [
        {
          title: 'Album ảnh',
          description: 'Lưu trữ và sắp xếp hình ảnh siêu âm, hình ảnh bụng bầu và những khoảnh khắc đặc biệt.',
          icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
        },
        {
          title: 'Nhật ký khoảnh khắc',
          description: 'Viết về trải nghiệm, cảm xúc và suy nghĩ của bạn trong suốt thai kỳ.',
          icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
        },
      ],
    },
    {
      id: 'community',
      title: 'Chia sẻ cộng đồng',
      description: 'Kết nối với những người khác và chia sẻ hành trình của bạn với người thân yêu.',
      features: [
        {
          title: 'Chia sẻ gia đình',
          description: 'Chia sẻ cập nhật, hình ảnh và cột mốc với các thành viên gia đình và bạn bè thân thiết.',
          icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.479m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
        },
        {
          title: 'Diễn đàn cộng đồng',
          description: 'Kết nối với các bà mẹ khác để chia sẻ kinh nghiệm và lời khuyên.',
          icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
        },
      ],
    },
  ];

  constructor() {}

  // Feature sections

  ngOnInit(): void {
    // Initialize component
  }
}
