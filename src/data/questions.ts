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
      prompt: "Nhà nước xã hội chủ nghĩa ra đời trong hoàn cảnh nào?",
      choices: [
        "Khi giai cấp tư sản phát triển mạnh",
        "Khi mâu thuẫn giai cấp trong xã hội tư bản gay gắt",
        "Khi xã hội phong kiến suy yếu",
        "Khi kinh tế hàng hóa phát triển",
      ],
      correctIndex: 1,
    },
    {
      id: "m1-q2",
      prompt: "Lực lượng lãnh đạo cách mạng dẫn đến sự ra đời của nhà nước xã hội chủ nghĩa là:",
      choices: [
        "Giai cấp nông dân",
        "Giai cấp tư sản",
        "Giai cấp công nhân thông qua Đảng Cộng sản",
        "Tầng lớp trí thức",
      ],
      correctIndex: 2,
    },
    {
      id: "m1-q3",
      prompt: "Nhà nước xã hội chủ nghĩa đầu tiên trên thế giới ra đời từ sự kiện nào?",
      choices: [
        "Cách mạng Pháp 1789",
        "Cách mạng Tháng Mười Nga",
        "Cách mạng Tháng Tám Việt Nam",
        "Công xã Paris",
      ],
      correctIndex: 1,
    },
    {
      id: "m1-q4",
      prompt: "Bản chất của nhà nước xã hội chủ nghĩa là gì?",
      choices: [
        "Phục vụ lợi ích của thiểu số",
        "Mang bản chất giai cấp công nhân, đại diện nhân dân lao động",
        "Đại diện cho giai cấp tư sản",
        "Trung lập về giai cấp",
      ],
      correctIndex: 1,
    },
    {
      id: "m1-q5",
      prompt: "Điểm khác biệt cơ bản giữa nhà nước XHCN và nhà nước bóc lột trước đây là:",
      choices: [
        "Có bộ máy hành chính",
        "Có pháp luật",
        "Hoạt động vì lợi ích của đa số nhân dân",
        "Có quân đội",
      ],
      correctIndex: 2,
    },
    // {
    //   id: "m1-q6",
    //   prompt: "Một trong những chức năng đối nội của nhà nước xã hội chủ nghĩa là:",
    //   choices: [
    //     "Thiết lập quan hệ ngoại giao",
    //     "Bảo vệ chủ quyền quốc gia",
    //     "Quản lý xã hội và phát triển kinh tế",
    //     "Ký kết điều ước quốc tế",
    //   ],
    //   correctIndex: 2,
    // },
    // {
    //   id: "m1-q7",
    //   prompt: "Chức năng đối ngoại của nhà nước xã hội chủ nghĩa nhằm mục đích chủ yếu nào?",
    //   choices: [
    //     "Mở rộng bóc lột",
    //     "Xâm lược các quốc gia khác",
    //     "Bảo vệ Tổ quốc và hợp tác quốc tế",
    //     "Can thiệp vào nội bộ nước khác",
    //   ],
    //   correctIndex: 2,
    // },
    // {
    //   id: "m1-q8",
    //   prompt: "Trong tư tưởng Hồ Chí Minh, nội dung cốt lõi nhất là:",
    //   choices: [
    //     "Công nghiệp hóa",
    //     "Độc lập dân tộc gắn liền với chủ nghĩa xã hội",
    //     "Phát triển kinh tế thị trường",
    //     "Xây dựng nhà nước pháp quyền",
    //   ],
    //   correctIndex: 1,
    // },
    // {
    //   id: "m1-q9",
    //   prompt: "Theo Hồ Chí Minh, độc lập dân tộc chỉ có ý nghĩa khi:",
    //   choices: [
    //     "Có chính quyền trung ương",
    //     "Được quốc tế công nhận",
    //     "Nhân dân được hưởng tự do, hạnh phúc",
    //     "Có quân đội mạnh",
    //   ],
    //   correctIndex: 2,
    // },
    // {
    //   id: "m1-q10",
    //   prompt: "Câu nói \"Không có gì quý hơn độc lập, tự do\" thể hiện rõ nhất tư tưởng nào?",
    //   choices: [
    //     "Đấu tranh giai cấp",
    //     "Phát triển kinh tế",
    //     "Giá trị tối cao của độc lập dân tộc",
    //     "Vai trò của nhà nước",
    //   ],
    //   correctIndex: 2,
    // },
  ],

  map2: [
    {
      id: "m2-q1",
      prompt: "Chế độ dân chủ nhân dân ở Việt Nam chính thức được xác lập sau sự kiện nào?",
      choices: [
        "Thành lập Đảng Cộng sản Việt Nam năm 1930.",
        "Thắng lợi của Cách mạng Tháng Tám năm 1945.",
        "Thắng lợi của Chiến dịch Hồ Chí Minh năm 1975.",
        "Đại hội Đảng lần thứ VI năm 1986.",
      ],
      correctIndex: 1,
    },
    {
      id: "m2-q2",
      prompt: "Theo tư tưởng Hồ Chí Minh, vị trí cao nhất trong nước ta thuộc về ai? ",
      choices: [
        "Đảng Cộng sản Việt Nam. ",
        "Chính phủ và bộ máy Nhà nước.",
        "Nhân dân. ",
        "Giai cấp công nhân",
      ],
      correctIndex: 2,
    },
    {
      id: "m2-q3",
      prompt: "Hình thức dân chủ gián tiếp tại Việt Nam được thực hiện thông qua việc nhân dân bầu ra cơ quan nào?",
      choices: [
        "Các tổ chức chính trị - xã hội tại cơ sở.",
        "Quốc hội và Hội đồng nhân dân các cấp.",
        "Các doanh nghiệp và tập đoàn kinh tế nhà nước.",
        "Các ban giám sát đầu tư của cộng đồng.",
      ],
      correctIndex: 1,
    },
    {
      id: "m2-q4",
      prompt: "Trong quá trình xây dựng Nhà nước pháp quyền ở nước ta, yếu tố nào được coi là trung tâm của sự phát triển?",
      choices: [
        "Các nguồn lực tài chính và tài nguyên thiên nhiên.",
        "Sự tăng trưởng của các tập đoàn kinh tế lớn.",
        "Tôn trọng và bảo đảm quyền con người, quyền công dân. ",
        "Việc mở rộng quy mô bộ máy hành chính nhà nước.",
      ],
      correctIndex: 2,
    },
    {
      id: "m2-q5",
      prompt: "Nhiệm vụ nào được xác định là cấp bách và lâu dài trong việc hoàn thiện Nhà nước pháp quyền Việt Nam hiện nay?",
      choices: [
        "Tăng cường số lượng các thủ tục hành chính.",
        "Đấu tranh phòng, chống tham nhũng, lãng phí và thực hành tiết kiệm. ",
        "Thay đổi toàn bộ hệ thống chính trị hiện có. ",
        "Hạn chế vai trò giám sát của các tổ chức xã hội.",
      ],
      correctIndex: 1,
    },
  ],

  final: [
    {
      id: "f-q1",
      prompt: "Đặc điểm nổi bật nhất của Nhà nước pháp quyền xã hội chủ nghĩa là gì? ",
      choices: [
        "Quản lý xã hội chủ yếu bằng các quy tắc đạo đức. ",
        "Đặt Hiến pháp và pháp luật ở vị trí tối thượng. ",
        "Tập trung quyền lực tuyệt đối vào cơ quan hành pháp. ",
        "Hoạt động không cần dựa trên sự lãnh đạo của Đảng.",
      ],
      correctIndex: 1,
    },
    {
      id: "f-q2",
      prompt: "Quyền lực nhà nước trong Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam được tổ chức theo nguyên tắc nào?",
      choices: [
        "Phân chia tuyệt đối giữa ba nhánh lập pháp, hành pháp và tư pháp. ",
        "Thống nhất, có sự phân công, phối hợp và kiểm soát giữa các cơ quan nhà nước. ",
        "Tập trung toàn bộ vào Chính phủ để đảm bảo tính nhanh chóng. ",
        "Chia nhỏ quyền lực cho các địa phương tự quyết định hoàn toàn.",
      ],
      correctIndex: 1,
    },
    {
      id: "f-q3",
      prompt: "Tổ chức nào đóng vai trò lãnh đạo Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam?",
      choices: [
        "Mặt trận Tổ quốc Việt Nam. ",
        "Đảng Cộng sản Việt Nam. ",
        "Liên đoàn Lao động Việt Nam. ",
        "Hội đồng nhân dân tối cao.",
      ],
      correctIndex: 1,
    },
    {
      id: "f-q4",
      prompt: "Phương châm thực hiện dân chủ tại cơ sở được Đảng ta khẳng định là gì? ",
      choices: [
        "Dân biết, dân bàn, dân làm, dân kiểm tra. ",
        "Dân đóng góp, Nhà nước thực hiện và quản lý. ",
        "Đảng quyết định, Nhà nước thi hành, nhân dân hưởng thụ. ",
        "Mọi công việc đều do các cấp chính quyền tự quyết định.",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q5",
      prompt: "Nhiệm vụ 'Cải cách hành chính, giảm mạnh và bãi bỏ các thủ tục hành chính gây phiền hà' thuộc nội dung nào trong xây dựng Nhà nước pháp quyền? ",
      choices: [
        "Đấu tranh phòng chống tham nhũng. ",
        "Xây dựng đội ngũ cán bộ, công chức. ",
        "Cải cách thể chế và phương thức hoạt động của Nhà nước. ",
        "Nâng cao vai trò của các tổ chức chính trị - xã hội.",
      ],
      correctIndex: 2,
    },
    {
      id: "f-q6",
      prompt: "Một trong những chức năng đối nội của nhà nước xã hội chủ nghĩa là:",
      choices: [
        "Thiết lập quan hệ ngoại giao",
        "Bảo vệ chủ quyền quốc gia",
        "Quản lý xã hội và phát triển kinh tế",
        "Ký kết điều ước quốc tế",
      ],
      correctIndex: 2,
    },
    {
      id: "f-q7",
      prompt: "Chức năng đối ngoại của nhà nước xã hội chủ nghĩa nhằm mục đích chủ yếu nào?",
      choices: [
        "Mở rộng bóc lột",
        "Xâm lược các quốc gia khác",
        "Bảo vệ Tổ quốc và hợp tác quốc tế",
        "Can thiệp vào nội bộ nước khác",
      ],
      correctIndex: 2,
    },
    {
      id: "f-q8",
      prompt: "Trong tư tưởng Hồ Chí Minh, nội dung cốt lõi nhất là:",
      choices: [
        "Công nghiệp hóa",
        "Độc lập dân tộc gắn liền với chủ nghĩa xã hội",
        "Phát triển kinh tế thị trường",
        "Xây dựng nhà nước pháp quyền",
      ],
      correctIndex: 1,
    },
    {
      id: "f-q9",
      prompt: "Theo Hồ Chí Minh, độc lập dân tộc chỉ có ý nghĩa khi:",
      choices: [
        "Có chính quyền trung ương",
        "Được quốc tế công nhận",
        "Nhân dân được hưởng tự do, hạnh phúc",
        "Có quân đội mạnh",
      ],
      correctIndex: 2,
    },
    {
      id: "f-q10",
      prompt: "Câu nói “Không có gì quý hơn độc lập, tự do” thể hiện rõ nhất tư tưởng nào?",
      choices: [
        "Đấu tranh giai cấp",
        "Phát triển kinh tế",
        "Giá trị tối cao của độc lập dân tộc",
        "Vai trò của nhà nước",
      ],
      correctIndex: 2,
    },
  ],
};
