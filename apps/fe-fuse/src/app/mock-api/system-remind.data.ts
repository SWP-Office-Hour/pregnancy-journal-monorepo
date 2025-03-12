export const SystemReminders: SystemReminder[] = [
  {
    week: 4,
    message: 'Mẹ nên bắt đầu uống vitamin trước sinh có chứa acid folic càng sớm càng tốt.',
  },
  {
    week: 7,
    message: 'Mẹ nên tiêm phòng cúm nếu đang trong mùa cúm, an toàn trong mọi giai đoạn thai kỳ.',
  },
  {
    week: 10,
    message: 'Mẹ nên thảo luận với bác sĩ về việc tiêm phòng uốn ván-bạch hầu-ho gà (Tdap) trong thai kỳ.',
  },
  {
    week: 13,
    message: 'Mẹ có thể bắt đầu tập các bài tập thể dục nhẹ nhàng dành cho bà bầu sau khi được bác sĩ cho phép.',
  },
  {
    week: 14,
    message: 'Mẹ nên đăng ký lớp tiền sản để học cách chăm sóc bản thân và chuẩn bị cho việc sinh nở.',
  },
  {
    week: 18,
    message: 'Mẹ nên kiểm tra sức khỏe răng miệng, vì thay đổi hormone có thể ảnh hưởng đến nướu răng.',
  },
  {
    week: 22,
    message: 'Mẹ nên tiêm vắc-xin Tdap (uốn ván-bạch hầu-ho gà) trong khoảng từ tuần 27-36 để bảo vệ bé khỏi ho gà.',
  },
  {
    week: 23,
    message: 'Mẹ nên chuẩn bị tinh thần và tìm hiểu về các phương pháp giảm đau khi sinh.',
  },
  {
    week: 25,
    message: 'Mẹ nên bắt đầu nghiên cứu về việc cho con bú và các phương pháp nuôi con bằng sữa mẹ.',
  },
  {
    week: 26,
    message: 'Mẹ nên xem xét đăng ký hiến máu cuống rốn nếu quan tâm đến việc này.',
  },
  {
    week: 27,
    message: 'Mẹ nên thảo luận với bác sĩ về kế hoạch sinh nở và những mong muốn của mình.',
  },
  {
    week: 29,
    message: 'Mẹ nên tìm hiểu về các dấu hiệu của chứng tiền sản giật và khi nào cần liên hệ với bác sĩ.',
  },
  {
    week: 31,
    message: 'Mẹ nên chọn bác sĩ nhi khoa cho bé và tìm hiểu về lịch khám sức khỏe sau sinh.',
  },
  {
    week: 33,
    message: 'Mẹ nên chuẩn bị các vật dụng cần thiết cho việc cho con bú như máy hút sữa, áo ngực cho con bú.',
  },
  {
    week: 35,
    message: 'Mẹ nên tìm hiểu về các phương pháp chăm sóc sức khỏe tinh thần sau sinh để phòng ngừa trầm cảm sau sinh.',
  },
  {
    week: 36,
    message: 'Mẹ nhớ thực hiện xét nghiệm GBS (Streptococcus nhóm B) theo chỉ định của bác sĩ.',
  },
  {
    week: 37,
    message: 'Mẹ nên chuẩn bị sẵn một danh sách người thân và bạn bè để thông báo khi em bé chào đời.',
  },
  {
    week: 38,
    message: 'Mẹ nên lắp đặt ghế an toàn cho bé trên xe ô tô trước khi đến ngày sinh.',
  },
  {
    week: 42,
    message: 'Nếu thai quá ngày, mẹ có thể được bác sĩ đề xuất khởi phát chuyển dạ để đảm bảo an toàn cho mẹ và bé.',
  },
];

export interface SystemReminder {
  week: number;
  message: string;
}
