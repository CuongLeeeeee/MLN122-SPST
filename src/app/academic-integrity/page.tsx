"use client";

import React from "react";
import styles from "./academic-integrity.module.css";

// ===========================
// SECTION 1: AI TOOLS USED
// ===========================
interface AIToolSession {
  tool: string;
  prompt: string;
  aiOutput: string;
  teamEdits: string;
}

const Section1_AITools: React.FC = () => {
  const copilotSessions: AIToolSession[] = [
    {
      tool: "GitHub Copilot (Claude Sonnet 4.5)",
      prompt: "Tạo game canvas 2D với top-down view, player movement sử dụng WASD và phím mũi tên, bao gồm Game class, Player class, Input system, Maps system với doors và interactive objects",
      aiOutput: "Copilot đã tạo ra toàn bộ cấu trúc game engine với Player class (movement, collision), Input system (keyboard handling), render loop, Maps.ts với các hàm tạo map/door/exhibit objects, và logic chuyển map. Code có cấu trúc rõ ràng với TypeScript types đầy đủ.",
      teamEdits: "Team đã chỉnh sửa và mở rộng: điều chỉnh vị trí shadow của player, tối ưu hóa collision detection, thêm smooth camera movement, cải thiện door placement logic, và tối ưu render performance cho nhiều objects"
    },
    {
      tool: "GitHub Copilot (ChatGPT 4)",
      prompt: "Tạo quiz modal component với multiple choice questions, answer validation, và animation khi chuyển câu hỏi",
      aiOutput: "Copilot sinh ra QuizModal component hoàn chỉnh với state management cho current question, answer selection, answer validation với correct/incorrect feedback, và basic styling với modal overlay",
      teamEdits: "Team đã tùy chỉnh và cải thiện: thêm sound effects cho correct/incorrect answers, cải thiện animation transitions giữa các câu hỏi, tích hợp với game state để lưu progress, và thêm quiz completion flow"
    }
  ];

  const notebookLMSessions: AIToolSession[] = [
    {
      tool: "NotebookLM",
      prompt: "Phân tích và tổng hợp khái niệm 'Nhà nước xã hội chủ nghĩa' từ tài liệu Hiến pháp 2013 và giáo trình MLN131",
      aiOutput: "NotebookLM đã phân tích các nguồn và tổng hợp: Nhà nước XHCN Việt Nam là nhà nước của nhân dân, do nhân dân và vì nhân dân. Quyền lực nhà nước là thống nhất, có sự phân công, phối hợp, kiểm soát giữa các cơ quan trong việc thực hiện các quyền lập pháp, hành pháp, tư pháp.",
      teamEdits: "Team đã tách các khái niệm chính thành các điểm riêng biệt, tạo cấu trúc phân cấp cho dễ hiểu trong flipbook và thiết kế câu hỏi quiz kiểm tra từng khía cạnh"
    },
    {
      tool: "NotebookLM",
      prompt: "Tổng hợp nội dung về 'Dân chủ xã hội chủ nghĩa' từ văn kiện Đại hội XIII và tài liệu học tập",
      aiOutput: "NotebookLM tổng hợp: Dân chủ XHCN là bản chất của chế độ ta, được thực hiện thông qua các hình thức dân chủ trực tiếp (trưng cầu dân ý, hội nghị cử tri) và dân chủ đại diện (bầu cử đại biểu). Nhân dân có quyền tham gia quản lý nhà nước và xã hội, được bảo đảm quyền giám sát hoạt động của các cơ quan nhà nước.",
      teamEdits: "Team đã đơn giản hóa ngôn ngữ học thuật, thêm ví dụ thực tế về các hình thức dân chủ để người chơi dễ liên hệ với đời sống"
    }
  ];

  const chatGPTSessions: AIToolSession[] = [
    {
      tool: "ChatGPT 4",
      prompt: "Giải thích khái niệm 'Nhà nước pháp quyền xã hội chủ nghĩa' và các đặc điểm cơ bản",
      aiOutput: "ChatGPT giải thích: Nhà nước pháp quyền XHCN là nhà nước do Hiến pháp và pháp luật điều chỉnh, trong đó Hiến pháp có hiệu lực pháp lý cao nhất. Đặc điểm: tôn trọng và bảo đảm quyền con người, bảo đảm tính minh bạch và trách nhiệm giải trình, có cơ chế kiểm soát quyền lực để phòng chống lạm quyền và tham nhũng.",
      teamEdits: "Team đã cấu trúc lại thành 4 đặc điểm chính với giải thích ngắn gọn cho từng đặc điểm, tạo câu hỏi quiz dạng matching và multiple choice"
    },
    {
      tool: "ChatGPT 4",
      prompt: "Mối quan hệ giữa dân chủ XHCN và nhà nước pháp quyền XHCN ở Việt Nam",
      aiOutput: "ChatGPT phân tích: Dân chủ XHCN và nhà nước pháp quyền XHCN có mối quan hệ gắn bó hữu cơ. Dân chủ là nội dung, pháp quyền là hình thức và phương thức bảo đảm. Nhà nước pháp quyền tạo khuôn khổ pháp lý để thực hiện dân chủ, trong khi dân chủ là mục tiêu và động lực phát triển nhà nước pháp quyền.",
      teamEdits: "Team đã đơn giản hóa mối quan hệ phức tạp này thành sơ đồ minh họa và các câu hỏi quiz giúp người chơi hiểu được sự tương tác giữa hai khái niệm"
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>1. Công cụ AI đã sử dụng</h2>
      
      <div className={styles.toolCategory}>
        <h3 className={styles.toolName}>GitHub Copilot (ChatGPT + Claude)</h3>
        <p className={styles.toolDescription}>
          Sử dụng để hỗ trợ viết code và phát triển giao diện game. 
          Copilot đã giúp tạo các component React, game logic, và tích hợp API.
        </p>
        
        <div className={styles.sessionList}>
          {copilotSessions.map((session, idx) => (
            <div key={idx} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <span className={styles.sessionTool}>{session.tool}</span>
              </div>
              
              <div className={styles.sessionContent}>
                <div className={styles.sessionBlock}>
                  <strong>Prompt:</strong>
                  <p>{session.prompt}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Output từ AI:</strong>
                  <p>{session.aiOutput}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Chỉnh sửa của nhóm:</strong>
                  <p className={styles.teamEdit}>{session.teamEdits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.toolCategory}>
        <h3 className={styles.toolName}>NotebookLM</h3>
        <p className={styles.toolDescription}>
          Sử dụng để phân tích và tổng hợp thông tin từ các tài liệu học thuật đã upload
          (Hiến pháp 2013, văn kiện Đại hội XIII, giáo trình MLN131) về các khái niệm:
          Nhà nước xã hội chủ nghĩa và Dân chủ xã hội chủ nghĩa.
        </p>
        
        <div className={styles.sessionList}>
          {notebookLMSessions.map((session, idx) => (
            <div key={idx} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <span className={styles.sessionTool}>{session.tool}</span>
              </div>
              
              <div className={styles.sessionContent}>
                <div className={styles.sessionBlock}>
                  <strong>Prompt:</strong>
                  <p>{session.prompt}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Output từ AI:</strong>
                  <p>{session.aiOutput}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Chỉnh sửa của nhóm:</strong>
                  <p className={styles.teamEdit}>{session.teamEdits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.toolCategory}>
        <h3 className={styles.toolName}>ChatGPT 4</h3>
        <p className={styles.toolDescription}>
          Sử dụng để tra cứu và giải thích các khái niệm lý thuyết về
          Nhà nước pháp quyền xã hội chủ nghĩa và mối quan hệ giữa các khái niệm chính trị.
        </p>
        
        <div className={styles.sessionList}>
          {chatGPTSessions.map((session, idx) => (
            <div key={idx} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <span className={styles.sessionTool}>{session.tool}</span>
              </div>
              
              <div className={styles.sessionContent}>
                <div className={styles.sessionBlock}>
                  <strong>Prompt:</strong>
                  <p>{session.prompt}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Output từ AI:</strong>
                  <p>{session.aiOutput}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Chỉnh sửa của nhóm:</strong>
                  <p className={styles.teamEdit}>{session.teamEdits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===========================
// SECTION 2: SOURCE VERIFICATION
// ===========================
interface Reference {
  id: string;
  title: string;
  url?: string;
  description: string;
}

interface ReferenceGroup {
  groupTitle: string;
  groupDescription: string;
  references: Reference[];
}

const Section2_SourceVerification: React.FC = () => {
  const referenceGroups: ReferenceGroup[] = [
    {
      groupTitle: "Cơ quan hành chính",
      groupDescription: "Các nguồn chính thức từ cơ quan Đảng và Nhà nước",
      references: [
        {
          id: "admin-1",
          title: "Tư liệu Văn kiện Đảng",
          url: "https://tulieuvankien.dangcongsan.vn/",
          description: "Văn kiện Đại hội XIII của Đảng, các nghị quyết và tài liệu về xây dựng nhà nước pháp quyền XHCN"
        },
        {
          id: "admin-2",
          title: "Cổng thông tin điện tử Chính phủ",
          url: "https://chinhphu.vn",
          description: "Thông tin chính thức về tổ chức và hoạt động của Chính phủ, các chính sách và pháp luật hiện hành"
        },
        {
          id: "admin-3",
          title: "Cổng thông tin xây dựng chính sách",
          url: "https://xaydungchinhsach.chinhphu.vn/",
          description: "Tài liệu về quy trình xây dựng chính sách, pháp luật và cơ chế tham gia của nhân dân"
        }
      ]
    },
    {
      groupTitle: "Nguồn khác",
      groupDescription: "Tài liệu học thuật và pháp luật chuyên ngành",
      references: [
        {
          id: "other-1",
          title: "Giáo trình Chủ nghĩa xã hội khoa học",
          description: "Giáo trình K-2021 - Các khái niệm cơ bản về Nhà nước xã hội chủ nghĩa, Dân chủ xã hội chủ nghĩa và Nhà nước pháp quyền xã hội chủ nghĩa"
        },
        {
          id: "other-2",
          title: "Thư viện pháp luật",
          url: "https://thuvienphapluat.vn/",
          description: "Hiến pháp 2013 (sửa đổi bổ sung 2024), các văn bản pháp luật và tài liệu tham khảo về hệ thống pháp luật Việt Nam"
        }
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>2. Kiểm chứng nguồn</h2>
      <p className={styles.sectionDescription}>
        Tất cả thông tin trong game đều được kiểm chứng và tham khảo từ các nguồn đáng tin cậy sau:
      </p>
      
      {referenceGroups.map((group, groupIdx) => (
        <div key={groupIdx} className={styles.referenceGroup}>
          <h3 className={styles.referenceGroupTitle}>{group.groupTitle}</h3>
          <p className={styles.referenceGroupDescription}>{group.groupDescription}</p>
          
          <div className={styles.referenceGrid}>
            {group.references.map((ref) => (
              <div key={ref.id} className={styles.referenceCard}>
                <div className={styles.referenceHeader}>
                  <h4>{ref.title}</h4>
                  {ref.url && (
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.referenceLink}
                    >
                      🔗 Truy cập
                    </a>
                  )}
                </div>
                <div className={styles.referencePlaceholder}>
                  <p>{ref.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

// ===========================
// SECTION 3: AI CREATIVE APPLICATION
// ===========================
interface ApplicationArea {
  title: string;
  description: string;
  details: string[];
}

const Section3_CreativeApplication: React.FC = () => {
  const applications: ApplicationArea[] = [
    {
      title: "Thiết kế giao diện",
      description: "Kết hợp AI và sáng tạo con người trong thiết kế UI/UX",
      details: [
        "AI (GitHub Copilot) đề xuất cấu trúc component và layout cơ bản",
        "Con người quyết định color scheme, spacing, và visual hierarchy phù hợp với theme bảo tàng",
        "AI hỗ trợ generate CSS animations, con người tinh chỉnh timing và easing cho mượt mà",
        "Kết quả: Giao diện game vừa hiện đại vừa mang tính giáo dục, dễ sử dụng"
      ]
    },
    {
      title: "Thu thập nội dung",
      description: "Quy trình thu thập và xử lý thông tin học thuật",
      details: [
        "AI (Perplexity) tìm kiếm và tổng hợp thông tin ban đầu từ nhiều nguồn",
        "Con người kiểm tra độ chính xác, đối chiếu với tài liệu gốc (Hiến pháp, văn kiện Đảng)",
        "AI hỗ trợ đề xuất cách diễn đạt dễ hiểu, con người điều chỉnh cho phù hợp ngữ cảnh Việt Nam",
        "Kết quả: Nội dung chính xác về mặt học thuật nhưng dễ tiếp cận với người chơi"
      ]
    },
    {
      title: "Tối ưu trải nghiệm người dùng",
      description: "Cải thiện gameplay và tương tác",
      details: [
        "AI đề xuất game mechanics như quiz system, flipbook navigation, map transitions",
        "Con người test và điều chỉnh difficulty, pacing, và feedback mechanisms",
        "AI sinh code cho sound effects và visual effects, con người fine-tune cho phù hợp mood",
        "Con người thiết kế progression system và reward, AI implement logic",
        "Kết quả: Gameplay engaging, motivate người chơi học tập qua trải nghiệm tương tác"
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>3. Ứng dụng AI sáng tạo</h2>
      <p className={styles.sectionDescription}>
        Dự án này thể hiện sự kết hợp hài hòa giữa AI và con người trong quá trình phát triển:
      </p>
      
      <div className={styles.applicationList}>
        {applications.map((app, idx) => (
          <div key={idx} className={styles.applicationCard}>
            <h3 className={styles.applicationTitle}>{app.title}</h3>
            <p className={styles.applicationDescription}>{app.description}</p>
            
            <ul className={styles.detailList}>
              {app.details.map((detail, detailIdx) => (
                <li key={detailIdx}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.synthesisBox}>
        <h4>Tổng hợp</h4>
        <p>
          AI đóng vai trò là công cụ hỗ trợ mạnh mẽ, tăng tốc độ phát triển và đề xuất giải pháp.
          Con người là người quyết định cuối cùng, đảm bảo chất lượng, tính chính xác, và phù hợp văn hóa.
          Sự kết hợp này tạo ra sản phẩm vừa hiệu quả vừa có giá trị giáo dục cao.
        </p>
      </div>
    </section>
  );
};

// ===========================
// SECTION 4: INTEGRITY COMMITMENT
// ===========================
interface CommitmentItem {
  category: string;
  items: string[];
}

const Section4_IntegrityCommitment: React.FC = () => {
  const commitments: CommitmentItem[] = [
    {
      category: "Cam kết liêm chính",
      items: [
        "Toàn bộ nội dung trong dự án được thu thập và xử lý một cách trung thực, không bịa đặt hay sao chép trái phép",
        "Mọi thông tin học thuật đều được kiểm chứng từ nguồn đáng tin cậy (Hiến pháp, văn kiện chính thức, giáo trình)",
        "Nhóm cam kết không sử dụng AI để thay thế hoàn toàn công việc mà chỉ sử dụng như công cụ hỗ trợ",
        "Tất cả output từ AI đều được review, chỉnh sửa, và kiểm tra kỹ lưỡng bởi các thành viên trong nhóm"
      ]
    },
    {
      category: "Đảm bảo",
      items: [
        "Đảm bảo tính chính xác của nội dung học thuật thông qua việc đối chiếu với tài liệu gốc",
        "Đảm bảo minh bạch về vai trò của AI trong quá trình phát triển dự án",
        "Đảm bảo mọi thành viên trong nhóm đều tham gia và đóng góp thực chất vào dự án",
        "Đảm bảo code được viết có chất lượng, maintainable, và tuân thủ best practices",
        "Đảm bảo trích dẫn và ghi nhận nguồn tham khảo một cách đầy đủ và chính xác"
      ]
    },
    {
      category: "Tuân thủ",
      items: [
        "Tuân thủ quy định về liêm chính học thuật của trường Đại học FPT",
        "Tuân thủ nguyên tắc sử dụng AI một cách có trách nhiệm và đạo đức",
        "Tuân thủ quy định về bảo vệ quyền tác giả và sở hữu trí tuệ",
        "Tuân thủ các tiêu chuẩn về chất lượng và yêu cầu của môn học MLN131",
        "Tuân thủ timeline và quy trình làm việc đã cam kết với giảng viên"
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>4. Cam kết liêm chính học thuật</h2>
      
      <div className={styles.commitmentList}>
        {commitments.map((commitment, idx) => (
          <div key={idx} className={styles.commitmentCategory}>
            <h3 className={styles.commitmentCategoryTitle}>{commitment.category}</h3>
            <ul className={styles.commitmentItems}>
              {commitment.items.map((item, itemIdx) => (
                <li key={itemIdx} className={styles.commitmentItem}>
                  <span className={styles.checkmark}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.signatureBox}>
        <p className={styles.signatureText}>
          Chúng tôi, các thành viên của nhóm, cam kết tuân thủ đầy đủ các nguyên tắc liêm chính học thuật nêu trên
          và chịu trách nhiệm hoàn toàn về tính trung thực của dự án này.
        </p>
        <div className={styles.signaturePlaceholder}>
          <p>[Chữ ký các thành viên nhóm]</p>
          <p>[Ngày tháng năm]</p>
        </div>
      </div>
    </section>
  );
};

// ===========================
// MAIN PAGE COMPONENT
// ===========================
export default function AcademicIntegrityPage() {
  const [activeSection, setActiveSection] = React.useState<number>(1);

  const sections = [
    { id: 1, title: "Công cụ AI", icon: "🤖" },
    { id: 2, title: "Kiểm chứng nguồn", icon: "📚" },
    { id: 3, title: "Ứng dụng sáng tạo", icon: "💡" },
    { id: 4, title: "Cam kết liêm chính", icon: "✓" }
  ];

  // Override body overflow for this page
  React.useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <a href="/" className={styles.backButton}>← Quay lại Game</a>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Liêm chính Học thuật</h1>
          <p className={styles.pageSubtitle}>
            Bảo tàng Lịch sử - Game học tập về Dân chủ xã hội chủ nghĩa và nhà nước xã hội chủ nghĩa
          </p>
          <p className={styles.courseName}>Môn học: MLN131 - Chủ nghĩa Xã hội khoa học</p>
        </div>
      </header>

      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`${styles.navItem} ${activeSection === section.id ? styles.navItemActive : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className={styles.navIcon}>{section.icon}</span>
              <span className={styles.navText}>{section.title}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.pageContent}>
        {activeSection === 1 && <Section1_AITools />}
        {activeSection === 2 && <Section2_SourceVerification />}
        {activeSection === 3 && <Section3_CreativeApplication />}
        {activeSection === 4 && <Section4_IntegrityCommitment />}
      </main>

      <footer className={styles.pageFooter}>
        <p>© 2026 - FPT University - Spring Semester</p>
        <a href="/" className={styles.backLink}>← Quay lại Game</a>
      </footer>
    </div>
  );
}
