// UI
export type PracticeLevel = "easy" | "medium" | "hard";

export type PracticeQuestion = {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export const PRACTICE_LEVEL_LABEL: Record<PracticeLevel, string> = {
  easy: "MỨC ĐỘ 1: DỄ",
  medium: "MỨC ĐỘ 2: TRUNG BÌNH",
  hard: "MỨC ĐỘ 3: KHÓ",
};

export const PRACTICE_QUESTIONS: Record<PracticeLevel, PracticeQuestion[]> = {
  easy: [
    {
      id: "e-1",
      prompt: "Kinh tế thị trường là sản phẩm của yếu tố nào?",
      choices: [
        "Chỉ riêng của chủ nghĩa tư bản",
        "Văn minh nhân loại",
        "Ý muốn chủ quan của Nhà nước",
        "Các cuộc cách mạng công nghiệp",
      ],
      correctIndex: 1,
    },
    {
      id: "e-2",
      prompt:
        "Hệ giá trị mục tiêu của kinh tế thị trường định hướng XHCN ở Việt Nam là gì?",
      choices: [
        "Chỉ tập trung vào tăng trưởng GDP",
        "Tự do cạnh tranh tuyệt đối",
        "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh",
        "Xây dựng nền kinh tế khép kín",
      ],
      correctIndex: 2,
    },
    {
      id: "e-3",
      prompt:
        "Ai là chủ thể giữ vai trò lãnh đạo nền kinh tế thị trường định hướng XHCN tại Việt Nam?",
      choices: [
        "Các tập đoàn đa quốc gia",
        "Hiệp hội doanh nghiệp",
        "Đảng Cộng sản Việt Nam",
        "Các tổ chức quốc tế",
      ],
      correctIndex: 2,
    },
    {
      id: "e-4",
      prompt:
        "Nền kinh tế thị trường định hướng XHCN ở Việt Nam vận hành theo các quy luật nào?",
      choices: [
        "Quy luật của thị trường",
        "Chỉ theo mệnh lệnh hành chính",
        "Chỉ theo kế hoạch của Nhà nước",
        "Quy luật của kinh tế tự nhiên",
      ],
      correctIndex: 0,
    },
    {
      id: "e-5",
      prompt:
        "Đảng ta bắt đầu quan niệm 'kinh tế hàng hóa có những mặt tích cực cần vận dụng' từ năm nào?",
      choices: ["1975", "1986", "1991", "2001"],
      correctIndex: 1,
    },
    {
      id: "e-6",
      prompt:
        "Đại hội nào của Đảng khẳng định mô hình kinh tế thị trường định hướng XHCN là mô hình kinh tế tổng quát trong thời kỳ quá độ?",
      choices: ["Đại hội VI", "Đại hội VIII", "Đại hội IX", "Đại hội XIII"],
      correctIndex: 2,
    },
    {
      id: "e-7",
      prompt:
        "Phát triển kinh tế thị trường định hướng XHCN thực chất là hướng tới điều gì?",
      choices: [
        "Các giá trị cốt lõi của xã hội mới",
        "Xây dựng lại mô hình kinh tế kế hoạch hóa tập trung",
        "Cạnh tranh để tiêu diệt các đối thủ",
        "Tích lũy tư bản cá biệt",
      ],
      correctIndex: 0,
    },
    {
      id: "e-8",
      prompt:
        "Thành phần kinh tế nào được Đảng xác định là 'một động lực quan trọng'?",
      choices: [
        "Kinh tế nhà nước",
        "Kinh tế tập thể",
        "Kinh tế tư nhân",
        "Kinh tế có vốn đầu tư nước ngoài",
      ],
      correctIndex: 2,
    },
    {
      id: "e-9",
      prompt:
        "Theo giáo trình, kinh tế thị trường có mô hình chung cho mọi quốc gia không?",
      choices: [
        "Có, tất cả đều giống nhau",
        "Không, mỗi nước có mô hình phù hợp với điều kiện riêng",
        "Chỉ có mô hình tư bản chủ nghĩa",
        "Chỉ có mô hình của các nước phát triển",
      ],
      correctIndex: 1,
    },
    {
      id: "e-10",
      prompt:
        "Yếu tố nào là 'đặc trưng tất yếu không thể thiếu' của mọi nền kinh tế thị trường?",
      choices: [
        "Sự điều tiết của Đảng Cộng sản",
        "Định hướng xã hội chủ nghĩa",
        "Các đặc trưng chung vốn có của kinh tế thị trường",
        "Chỉ dựa vào sở hữu tư nhân",
      ],
      correctIndex: 2,
    },
  ],
  medium: [
    {
      id: "m-11",
      prompt:
        "Tại sao sự hình thành kinh tế thị trường ở Việt Nam là tất yếu khách quan?",
      choices: [
        "Do các điều kiện cho sự hình thành kinh tế hàng hóa đang tồn tại khách quan",
        "Do sức ép từ các tổ chức tài chính thế giới",
        "Để thay thế hoàn toàn nền kinh tế nhà nước",
        "Do lực lượng sản xuất đã phát triển đến mức tuyệt đối",
      ],
      correctIndex: 0,
    },
    {
      id: "m-12",
      prompt:
        "Kinh tế thị trường ưu việt hơn mô hình phi thị trường ở điểm nào?",
      choices: [
        "Loại bỏ hoàn toàn sự can thiệp của Nhà nước",
        "Là phương thức phân bổ nguồn lực hiệu quả nhất mà loài người đạt được",
        "Đảm bảo mọi người đều có thu nhập bằng nhau ngay lập tức",
        "Không bao giờ xảy ra khủng hoảng",
      ],
      correctIndex: 1,
    },
    {
      id: "m-13",
      prompt:
        "Vì sao nói kinh tế thị trường định hướng XHCN phù hợp với xu thế thời đại?",
      choices: [
        "Vì nó lặp lại chính xác mô hình của chủ nghĩa tư bản",
        "Vì nó giúp bắt kịp trình độ văn minh nhân loại và vượt qua các mâu thuẫn của CNTB",
        "Vì nó không cần hội nhập quốc tế",
        "Vì nó xóa bỏ hoàn toàn các quy luật thị trường",
      ],
      correctIndex: 1,
    },
    {
      id: "m-14",
      prompt: "Vai trò của Nhà nước pháp quyền XHCN trong nền kinh tế là gì?",
      choices: [
        "Thay thế thị trường để định giá hàng hóa",
        "Quản lý, điều tiết để hướng tới mục tiêu dân giàu, nước mạnh",
        "Chỉ bảo vệ quyền lợi các tập đoàn lớn",
        "Không can thiệp vào hoạt động kinh tế",
      ],
      correctIndex: 1,
    },
    {
      id: "m-15",
      prompt:
        "Theo Đại hội XII, nền kinh tế Việt Nam có đặc điểm gì về hội nhập?",
      choices: [
        "Kinh tế khép kín",
        "Kinh tế thị trường hiện đại, hội nhập quốc tế",
        "Hạn chế vốn nước ngoài",
        "Chỉ hội nhập với các nước XHCN",
      ],
      correctIndex: 1,
    },
    {
      id: "m-16",
      prompt: "Tác động tích cực của kinh tế thị trường là gì?",
      choices: [
        "Duy trì tự cấp tự túc",
        "Thúc đẩy phân công lao động xã hội",
        "Chỉ khai thác tài nguyên",
        "Ngăn cản công nghệ mới",
      ],
      correctIndex: 1,
    },
    {
      id: "m-17",
      prompt: "Mâu thuẫn của kinh tế thị trường tư bản chủ nghĩa nằm ở đâu?",
      choices: [
        "Thiếu một đảng lãnh đạo",
        "Mâu thuẫn giữa sản xuất xã hội hóa và chiếm hữu tư nhân",
        "Người dân không muốn phát triển",
        "Khoa học phát triển chậm",
      ],
      correctIndex: 1,
    },
    {
      id: "m-18",
      prompt: "Lựa chọn mô hình này phản ánh điều gì?",
      choices: [
        "Sao chép nước ngoài",
        "Đi đúng quy luật khách quan",
        "Ý chí chủ quan",
        "Quay lại phong kiến",
      ],
      correctIndex: 1,
    },
    {
      id: "m-19",
      prompt: "Yếu tố nào không mất đi trong thời kỳ quá độ?",
      choices: [
        "Sở hữu toàn dân tuyệt đối",
        "Phân công lao động và đa dạng sở hữu",
        "Bao cấp toàn diện",
        "Mệnh lệnh hành chính",
      ],
      correctIndex: 1,
    },
    {
      id: "m-20",
      prompt: "'Công bằng' trong mô hình Việt Nam là gì?",
      choices: [
        "Không cần công bằng",
        "Công bằng về cơ hội và thụ hưởng",
        "Chia đều tài sản",
        "Chỉ khi giàu mới công bằng",
      ],
      correctIndex: 1,
    },
  ],
  hard: [
    {
      id: "h-21",
      prompt:
        "Trong các kỳ Đại hội gần đây, Đảng Cộng sản Việt Nam xác định kinh tế thị trường định hướng xã hội chủ nghĩa có vị trí như thế nào?",
      choices: [
        "Là mô hình kinh tế chỉ áp dụng riêng cho lĩnh vực công nghiệp.",
        "Là mô hình kinh tế tổng quát của nước ta trong thời kỳ quá độ lên chủ nghĩa xã hội.",
        "Là giải pháp kinh tế tạm thời để khắc phục khủng hoảng.",
        "Là sự kết hợp cơ giới giữa kinh tế kế hoạch và kinh tế thị trường.",
      ],
      correctIndex: 1,
    },
    {
      id: "h-22",
      prompt:
        "Vì sao thực tiễn lịch sử cho thấy không tồn tại một nền kinh tế thị trường trừu tượng hay 'chung chung' cho mọi quốc gia?",
      choices: [
        "Vì mỗi nền kinh tế thị trường đều gắn với những điều kiện lịch sử, chính trị và xã hội cụ thể của từng nước.",
        "Vì mỗi quốc gia đều có các quy luật kinh tế riêng biệt, không tuân theo quy luật thị trường toàn cầu.",
        "Vì các quy luật của kinh tế thị trường chỉ mang tính chất lý thuyết và không có giá trị thực tiễn.",
        "Vì mỗi quốc gia có quyền tự tạo ra các quy luật kinh tế theo ý chí chủ quan của mình.",
      ],
      correctIndex: 0,
    },
    {
      id: "h-23",
      prompt:
        "Tại sao phát triển kinh tế thị trường định hướng xã hội chủ nghĩa lại được khẳng định là phù hợp với nguyện vọng của nhân dân Việt Nam?",
      choices: [
        "Vì mô hình này giúp triệt tiêu hoàn toàn sự cạnh tranh giữa các doanh nghiệp.",
        "Vì giúp tăng thu nhập, khuyến khích tính năng động, sáng tạo và cải thiện đời sống nhân dân.",
        "Vì nhân dân sẽ được hưởng mọi phúc lợi xã hội mà không cần tham gia lao động.",
        "Vì mô hình này hướng tới việc xóa bỏ hoàn toàn vai trò quản lý kinh tế của Nhà nước.",
      ],
      correctIndex: 1,
    },
    {
      id: "h-24",
      prompt:
        "Nhận thức của Đảng Cộng sản Việt Nam về kinh tế thị trường đã có bước thay đổi căn bản như thế nào kể từ khi bắt đầu công cuộc Đổi mới (1986)?",
      choices: [
        "Từ chỗ phủ nhận hoàn toàn sang chấp nhận sự tồn tại của nó như một yếu tố khách quan.",
        "Từ chỗ coi là công cụ, phương thức đến xác định là mô hình kinh tế tổng quát trong thời kỳ quá độ.",
        "Từ chỗ xác định là mục tiêu phát triển lâu dài sang coi là công cụ phát triển ngắn hạn.",
        "Không có sự thay đổi nào đáng kể về nhận thức lý luận trong suốt quá trình phát triển.",
      ],
      correctIndex: 1,
    },
    {
      id: "h-25",
      prompt:
        "Trong nền kinh tế Việt Nam hiện nay, mối quan hệ giữa 'định hướng xã hội chủ nghĩa' và 'kinh tế thị trường' được hiểu như thế nào?",
      choices: [
        "Là hai yếu tố đối lập, loại trừ và kìm hãm lẫn nhau.",
        "Là sự thống nhất biện chứng, kết hợp các mặt tích cực của thị trường với bản chất ưu việt của chủ nghĩa xã hội.",
        "Là sự thay thế hoàn toàn các quy luật kinh tế thị trường bằng các mục tiêu xã hội.",
        "Là hai hệ thống vận hành riêng biệt, không có sự tác động hay liên quan đến nhau.",
      ],
      correctIndex: 1,
    },
    {
      id: "h-26",
      prompt:
        "Tại sao Việt Nam không lựa chọn phát triển theo mô hình kinh tế thị trường tư bản chủ nghĩa thuần túy?",
      choices: [
        "Vì nền kinh tế tư bản chủ nghĩa hiện nay không còn khả năng thúc đẩy lực lượng sản xuất.",
        "Vì những mâu thuẫn vốn có của nó không thể tự khắc phục được trong lòng xã hội tư bản.",
        "Vì mô hình tư bản chủ nghĩa không chấp nhận việc hội nhập kinh tế quốc tế sâu rộng.",
        "Vì nhân dân Việt Nam không có nhu cầu làm giàu về mặt vật chất trong quá trình phát triển.",
      ],
      correctIndex: 1,
    },
    {
      id: "h-27",
      prompt:
        "Điểm khác biệt quan trọng nhất về quản lý của kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam so với các mô hình khác là gì?",
      choices: [
        "Mọi quan hệ trao đổi đều không sử dụng tiền tệ làm môi giới.",
        "Có sự quản lý của Nhà nước pháp quyền xã hội chủ nghĩa dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.",
        "Không vận hành theo các quy luật khách quan như cung - cầu hay quy luật giá trị.",
        "Chỉ có các doanh nghiệp nhà nước mới được quyền tham gia vào các thị trường then chốt.",
      ],
      correctIndex: 1,
    },
    {
      id: "h-28",
      prompt:
        "'Tính quy luật' của việc phát triển kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam được thể hiện ở khía cạnh nào?",
      choices: [
        "Là kết quả của sự áp đặt ý chí chủ quan từ phía Nhà nước.",
        "Là sự chuyển đổi tất yếu từ kinh tế hàng hóa lên kinh tế thị trường theo xu thế khách quan.",
        "Là quá trình quay trở lại nền kinh tế tự nhiên, tự cấp tự túc để đảm bảo an ninh.",
        "Là sự phát triển theo một con đường hoàn toàn tách biệt, không liên quan đến văn minh nhân loại.",
      ],
      correctIndex: 1,
    },
    {
      id: "h-29",
      prompt:
        "Theo giáo trình, sự phát triển kinh tế thị trường định hướng xã hội chủ nghĩa góp phần nâng cao trình độ văn minh xã hội thông qua yếu tố nào?",
      choices: [
        "Khuyến khích sáng tạo, phân bổ nguồn lực hiệu quả và gắn tăng trưởng với công bằng xã hội.",
        "Duy trì sự ổn định xã hội thông qua các chính sách trợ cấp bao cấp của Nhà nước.",
        "Giảm thiểu các mối liên kết kinh tế giữa các vùng, miền để tập trung nguồn lực.",
        "Đóng cửa nền kinh tế để bảo vệ các giá trị văn hóa truyền thống trước tác động bên ngoài.",
      ],
      correctIndex: 0,
    },
    {
      id: "h-30",
      prompt:
        "Mục tiêu hàng đầu và xuyên suốt của nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam là gì?",
      choices: [
        "Duy trì nền sản xuất ở trình độ thấp để đảm bảo sự bình đẳng tuyệt đối.",
        "Xây dựng cơ sở vật chất của CNXH, thực hiện 'dân giàu, nước mạnh, dân chủ, công bằng, văn minh'.",
        "Tập trung mọi nguồn lực để làm giàu cho một bộ phận thiểu số trong xã hội.",
        "Mở rộng thị trường xuất khẩu bằng mọi giá, kể cả việc hy sinh môi trường và phúc lợi xã hội.",
      ],
      correctIndex: 1,
    },
  ],
};
