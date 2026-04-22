//UI
export type QuizId = "map1" | "map2" | "final";

export type Question = {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export const QUIZ_QUESTIONS: Record<QuizId, Question[]> = {
  map1: [
    {
      id: "m1-q1",
      prompt:
        "Theo giáo trình, kinh tế thị trường định hướng XHCN ở Việt Nam được hiểu là gì?",
      choices: [
        "Là một mô hình kinh tế thị trường tự do tuyệt đối.",
        "Là nền kinh tế vận hành theo các quy luật của thị trường, hướng tới mục tiêu dân giàu, nước mạnh, dân chủ, công bằng, văn minh, dưới sự lãnh đạo của Đảng Cộng sản.",
        "Là nền kinh tế chỉ dựa trên sở hữu nhà nước và kế hoạch hóa tập trung.",
        "Là nền kinh tế thị trường tư bản chủ nghĩa có sự điều tiết của Nhà nước.",
      ],
      correctIndex: 1,
    },
    {
      id: "m1-q2",
      prompt:
        "Hệ giá trị nào được xem là mục tiêu của xã hội tương lai mà nền kinh tế thị trường định hướng XHCN hướng tới?",
      choices: [
        "Công nghiệp hóa, hiện đại hóa đất nước.",
        "Tự do, bình đẳng, bác ái.",
        "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh.",
        "Tăng trưởng kinh tế nhanh và bền vững.",
      ],
      correctIndex: 2,
    },
    {
      id: "m1-q3",
      prompt:
        "Đại hội XIII của Đảng khẳng định mô hình kinh tế thị trường định hướng XHCN có vị thế như thế nào?",
      choices: [
        "Là mô hình kinh tế tạm thời trong giai đoạn khó khăn.",
        "Là mô hình kinh tế tổng quát của nước ta trong thời kỳ quá độ lên chủ nghĩa xã hội.",
        "Là bước đệm để tiến thẳng lên kinh tế cộng sản chủ nghĩa.",
        "Là mô hình sao chép nguyên văn từ các nước phát triển.",
      ],
      correctIndex: 1,
    },
    {
      id: "m1-q4",
      prompt:
        "Tính tất yếu khách quan của việc phát triển kinh tế thị trường định hướng XHCN ở Việt Nam xuất phát từ lý do nào?",
      choices: [
        "Do mong muốn chủ quan của các nhà lãnh đạo.",
        "Do sự áp đặt của các tổ chức quốc tế.",
        "Phù hợp với xu hướng phát triển khách quan của thế giới và sự tồn tại khách quan của các điều kiện kinh tế hàng hóa tại Việt Nam.",
        "Để thu hút vốn đầu tư nước ngoài bằng mọi giá.",
      ],
      correctIndex: 2,
    },
  ],

  map2: [],

  final: [
    {
      id: "f-q1",
      prompt:
        "Tại sao kinh tế thị trường lại được Việt Nam lựa chọn làm phương thức phát triển?",
      choices: [
        "Vì nó là phương thức phân bổ nguồn lực hiệu quả nhất mà loài người từng đạt được so với mô hình phi thị trường.",
        "Vì nó giúp loại bỏ hoàn toàn sự can thiệp của Nhà nước.",
        "Vì nó bảo đảm sự công bằng tuyệt đối cho mọi người ngay lập tức.",
        "Vì nó chỉ tập trung vào lợi ích của các tập đoàn lớn.",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q2",
      prompt:
        "Vai trò lãnh đạo của Đảng Cộng sản Việt Nam trong nền kinh tế này là gì?",
      choices: [
        "Trực tiếp điều hành các hoạt động sản xuất kinh doanh của từng doanh nghiệp.",
        "Lãnh đạo thông qua cương lĩnh, đường lối, các quyết sách lớn để bảo đảm tính định hướng XHCN.",
        "Thay thế hoàn toàn các quy luật của thị trường bằng mệnh lệnh hành chính.",
        "Chỉ tập trung vào công tác tư tưởng, không can thiệp vào kinh tế.",
      ],
      correctIndex: 1,
    },
    {
      id: "f-q3",
      prompt:
        "Phát triển kinh tế thị trường định hướng XHCN giúp giải quyết vấn đề gì trong sản xuất tại Việt Nam?",
      choices: [
        "Duy trì mô hình hợp tác xã kiểu cũ.",
        "Phá vỡ tính chất tự cấp, tự túc, lạc hậu của nền kinh tế.",
        "Tập trung hóa toàn bộ ruộng đất vào tay Nhà nước.",
        "Ngăn cản sự xâm nhập của công nghệ hiện đại.",
      ],
      correctIndex: 1,
    },
    {
      id: "f-q4",
      prompt:
        "Định hướng XHCN trong kinh tế thị trường thực chất là hướng tới điều gì?",
      choices: [
        "Xóa bỏ hoàn toàn sở hữu tư nhân.",
        "Hướng tới các giá trị cốt lõi của xã hội mới: dân giàu, nước mạnh, dân chủ, công bằng, văn minh.",
        "Xây dựng một nền kinh tế khép kín, không giao thương với nước ngoài.",
        "Ưu tiên tuyệt đối cho tăng trưởng GDP mà không cần quan tâm đến xã hội.",
      ],
      correctIndex: 1,
    },
    {
      id: "f-q5",
      prompt:
        "Về quan hệ sở hữu, thành phần kinh tế nào giữ vai trò chủ đạo trong nền kinh tế thị trường định hướng XHCN ở Việt Nam?",
      choices: [
        "Kinh tế tư nhân.",
        "Kinh tế có vốn đầu tư nước ngoài.",
        "Kinh tế nhà nước.",
        "Kinh tế cá thể, tiểu chủ.",
      ],
      correctIndex: 2,
    },
  ],
};
