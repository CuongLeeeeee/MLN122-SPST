//UI
import {
  PRACTICE_LEVEL_LABEL,
  PRACTICE_QUESTIONS,
  type PracticeLevel,
} from "@/data/practiceQuestions";

export type FlipbookId =
  | "m1-chuc-nang"
  | "m1-phap-luat"
  | "m1-to-chuc"
  | "m2-dan-chu"
  | "m2-phap-quyen"
  | "m2-phat-huy"
  | "m3-kho-de"
  | "m3-tong-ket1"
  | "m3-tong-ket2";

export type Flipbook = {
  id: FlipbookId;
  title: string;
  pages: string[];
  embedUrl?: string;
};

const PRACTICE_LEVELS: PracticeLevel[] = ["easy", "medium", "hard"];

function buildPracticePages(): string[] {
  const pages: string[] = [];
  const answerLines: string[] = [];
  let questionNumber = 1;

  for (const level of PRACTICE_LEVELS) {
    const questions = PRACTICE_QUESTIONS[level];

    for (let startIndex = 0; startIndex < questions.length; startIndex += 5) {
      const chunk = questions.slice(startIndex, startIndex + 5);
      const sectionTitle = `${PRACTICE_LEVEL_LABEL[level]}${startIndex > 0 ? " - TIẾP" : ""}`;
      const lines: string[] = [sectionTitle, ""];

      for (const question of chunk) {
        lines.push(`Câu ${questionNumber}: ${question.prompt}`);
        question.choices.forEach((choice, choiceIndex) => {
          lines.push(`${String.fromCharCode(65 + choiceIndex)}. ${choice}`);
        });
        lines.push("");
        answerLines.push(
          `${questionNumber}-${String.fromCharCode(65 + question.correctIndex)}`,
        );
        questionNumber += 1;
      }

      pages.push(lines.join("\n").trim());
    }
  }

  pages.push(
    [
      "ĐÁP ÁN THAM KHẢO",
      "",
      answerLines.slice(0, 10).join(", ") + ".",
      answerLines.slice(10, 20).join(", ") + ".",
      answerLines.slice(20, 30).join(", ") + ".",
    ].join("\n"),
  );

  return pages;
}

export const FLIPBOOKS: Record<FlipbookId, Flipbook> = {
  "m1-chuc-nang": {
    id: "m1-chuc-nang",
    title: "Chức năng của Nhà nước XHCN",
    pages: [
      "Tổ chức, quản lý xã hội; giữ vững trật tự, kỷ cương.",
      "Phát triển kinh tế, văn hóa, giáo dục; thực hiện an sinh xã hội.",
      "Bảo vệ Tổ quốc và mở rộng quan hệ đối ngoại hòa bình.",
    ],
  },
  "m1-phap-luat": {
    id: "m1-phap-luat",
    title: "Nguồn gốc chủ nghĩa xã hội",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/8f1f85a8dd.html",
  },
  "m1-to-chuc": {
    id: "m1-to-chuc",
    title: "Quá trình nhận thức của Đảng",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/fa9141b009.html",
  },
  "m2-dan-chu": {
    id: "m2-dan-chu",
    title: "Dân chủ xã hội chủ nghĩa ở Việt Nam",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/67ced5848e.html",
  },
  "m2-phap-quyen": {
    id: "m2-phap-quyen",
    title: "Nhà nước pháp quyền XHCN ở Việt Nam",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/78e19834d2.html",
  },
  "m2-phat-huy": {
    id: "m2-phat-huy",
    title: "Phát huy và xây dựng nhà nước pháp quyền XHCN ở Việt Nam",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/a742a2e1b3.html",
  },
  "m3-kho-de": {
    id: "m3-kho-de",
    title: "Kho đề ôn luyện KTTT định hướng XHCN",
    pages: buildPracticePages(),
  },
  "m3-tong-ket1": {
    id: "m3-tong-ket1",
    title: "Tính tất yếu khách quan",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/37e51d7abf.html",
  },
  "m3-tong-ket2": {
    id: "m3-tong-ket2",
    title: "Tính tất yếu khách quan",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/b3b3b6ae32.html",
  },
};
