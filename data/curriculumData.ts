
export interface CurriculumStandard {
  grade: string;
  keywords: string[]; // Keywords to match user input
  topic: string; // Display name
  content: {
    nb: string[]; // Nhận biết
    th: string[]; // Thông hiểu
    vd: string[]; // Vận dụng (Low + High combined)
  };
}

export const CURRICULUM_DATA: CurriculumStandard[] = [
  // --- LỚP 6 ---
  {
    grade: "Lớp 6",
    keywords: ["số tự nhiên", "tập hợp"],
    topic: "Số tự nhiên và tập hợp",
    content: {
      nb: ["Nhận biết được tập hợp các số tự nhiên.", "Nhận biết thứ tự thực hiện các phép tính."],
      th: ["Biểu diễn được số tự nhiên trong hệ thập phân.", "Biểu diễn số La Mã (1-30)."],
      vd: ["Sử dụng thuật ngữ tập hợp, phần tử.", "Giải quyết vấn đề thực tiễn gắn với phép tính."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["chia hết", "nguyên tố", "ước", "bội"],
    topic: "Tính chia hết & Số nguyên tố",
    content: {
      nb: ["Nhận biết quan hệ chia hết, ước, bội.", "Nhận biết số nguyên tố, hợp số.", "Phép chia có dư."],
      th: ["Phân tích một số ra thừa số nguyên tố."],
      vd: ["Vận dụng dấu hiệu chia hết (2,3,5,9).", "Tìm UCLN, BCNN để giải quyết vấn đề thực tiễn."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["số nguyên", "âm"],
    topic: "Số nguyên",
    content: {
      nb: ["Nhận biết số nguyên âm, tập hợp Z.", "Số đối của một số nguyên."],
      th: ["Biểu diễn số nguyên trên trục số.", "So sánh hai số nguyên."],
      vd: ["Thực hiện phép tính cộng/trừ/nhân/chia số nguyên.", "Quy tắc dấu ngoặc."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["hình học", "trực quan", "tam giác", "vuông", "lục giác"],
    topic: "Các hình phẳng cơ bản",
    content: {
      nb: ["Nhận dạng tam giác đều, hình vuông, lục giác đều.", "Hình chữ nhật, hình thoi, hình bình hành."],
      th: ["Mô tả yếu tố cơ bản (cạnh, góc, đường chéo).", "Vẽ hình bằng dụng cụ học tập."],
      vd: ["Tính chu vi và diện tích các hình học cơ bản.", "Giải quyết vấn đề thực tiễn liên quan."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["thống kê", "dữ liệu", "biểu đồ"],
    topic: "Thống kê & Xác suất",
    content: {
      nb: ["Thu thập, phân loại dữ liệu.", "Đọc biểu đồ tranh, biểu đồ cột."],
      th: ["Mô tả dữ liệu trên bảng, biểu đồ."],
      vd: ["Lựa chọn và biểu diễn dữ liệu vào bảng/biểu đồ thích hợp."]
    }
  },

  // --- LỚP 7 ---
  {
    grade: "Lớp 7",
    keywords: ["hữu tỉ", "tỉ lệ"],
    topic: "Số hữu tỉ",
    content: {
      nb: ["Nhận biết số hữu tỉ, số đối.", "Tập hợp Q."],
      th: ["Biểu diễn số hữu tỉ trên trục số.", "Mô tả lũy thừa, thứ tự thực hiện."],
      vd: ["So sánh hai số hữu tỉ.", "Cộng, trừ, nhân, chia số hữu tỉ.", "Giải quyết bài toán thực tiễn."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["số thực", "căn", "vô tỉ"],
    topic: "Số thực",
    content: {
      nb: ["Nhận biết căn bậc hai số học.", "Số vô tỉ, số thực.", "Số đối, giá trị tuyệt đối."],
      th: ["Tính căn bậc hai số học (gần đúng).", "Làm tròn số."],
      vd: ["Ước lượng và làm tròn số căn cứ độ chính xác."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["tỉ lệ thức", "dãy tỉ số"],
    topic: "Tỉ lệ thức & Đại lượng tỉ lệ",
    content: {
      nb: ["Nhận biết tỉ lệ thức.", "Dãy tỉ số bằng nhau."],
      th: ["Giải thích tính chất tỉ lệ thức."],
      vd: ["Giải toán về đại lượng tỉ lệ thuận/nghịch.", "Bài toán chia tỉ lệ."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["biểu thức", "đa thức"],
    topic: "Biểu thức đại số",
    content: {
      nb: ["Nhận biết biểu thức số, biểu thức đại số.", "Đa thức một biến, nghiệm."],
      th: ["Xác định bậc của đa thức.", "Tính giá trị biểu thức."],
      vd: ["Cộng, trừ, nhân, chia đa thức một biến."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["hình học", "góc", "song song"],
    topic: "Các hình hình học cơ bản",
    content: {
      nb: ["Góc ở vị trí đặc biệt (kề bù, đối đỉnh).", "Tia phân giác.", "Hai đường thẳng song song."],
      th: ["Mô tả tính chất hai đường thẳng song song.", "Dấu hiệu nhận biết song song."],
      vd: ["Tính số đo góc.", "Chứng minh song song."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["tam giác", "bằng nhau"],
    topic: "Tam giác bằng nhau",
    content: {
      nb: ["Tổng 3 góc trong tam giác.", "Hai tam giác bằng nhau.", "Tam giác cân."],
      th: ["Giải thích các trường hợp bằng nhau (c.c.c, c.g.c, g.c.g)."],
      vd: ["Chứng minh hai tam giác bằng nhau.", "Tính độ dài đoạn thẳng, số đo góc."]
    }
  },

  // --- LỚP 8 ---
  {
    grade: "Lớp 8",
    keywords: ["đa thức", "nhiều biến"],
    topic: "Đa thức nhiều biến",
    content: {
      nb: ["Nhận biết đơn thức, đa thức nhiều biến."],
      th: ["Tính giá trị đa thức khi biết giá trị biến."],
      vd: ["Thu gọn đơn thức, đa thức.", "Cộng, trừ, nhân, chia đa thức nhiều biến."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hằng đẳng thức"],
    topic: "Hằng đẳng thức đáng nhớ",
    content: {
      nb: ["Nhận biết hằng đẳng thức."],
      th: ["Mô tả 7 hằng đẳng thức đáng nhớ."],
      vd: ["Vận dụng hằng đẳng thức để khai triển hoặc rút gọn.", "Phân tích đa thức thành nhân tử."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["phân thức"],
    topic: "Phân thức đại số",
    content: {
      nb: ["Định nghĩa phân thức, điều kiện xác định.", "Hai phân thức bằng nhau."],
      th: ["Tính chất cơ bản của phân thức."],
      vd: ["Cộng, trừ, nhân, chia phân thức.", "Rút gọn phân thức."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hàm số", "bậc nhất", "đồ thị"],
    topic: "Hàm số bậc nhất",
    content: {
      nb: ["Khái niệm hàm số, đồ thị.", "Hệ số góc của đường thẳng."],
      th: ["Thiết lập bảng giá trị y=ax+b.", "Tính chất đồng biến/nghịch biến."],
      vd: ["Vẽ đồ thị hàm số bậc nhất.", "Xác định đường thẳng đi qua 2 điểm."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["phương trình", "bậc nhất"],
    topic: "Phương trình bậc nhất",
    content: {
      nb: ["Nhận biết phương trình bậc nhất một ẩn."],
      th: ["Mô tả cách giải phương trình ax+b=0."],
      vd: ["Giải phương trình bậc nhất.", "Giải toán bằng cách lập phương trình."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["chóp", "hình khối"],
    topic: "Hình chóp (Trực quan)",
    content: {
      nb: ["Mô tả đỉnh, mặt đáy, mặt bên hình chóp tam giác/tứ giác đều."],
      th: ["Tạo lập hình chóp.", "Công thức diện tích xung quanh, thể tích."],
      vd: ["Tính diện tích, thể tích hình chóp trong thực tế."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["pythagore", "tứ giác", "đồng dạng", "thalès", "thales"],
    topic: "Hình học phẳng (Lớp 8)",
    content: {
      nb: ["Định lí Pythagore.", "Tứ giác lồi.", "Hình thang cân, Hình bình hành, HCN, Hình thoi, Hình vuông."],
      th: ["Định lí Thalès.", "Tam giác đồng dạng.", "Đường trung bình."],
      vd: ["Tính độ dài cạnh dùng Pythagore/Thalès.", "Chứng minh đồng dạng.", "Chứng minh tứ giác đặc biệt."]
    }
  },

  // --- LỚP 9 ---
  {
    grade: "Lớp 9",
    keywords: ["căn thức", "căn bậc"],
    topic: "Căn thức",
    content: {
      nb: ["Căn bậc hai số học.", "Căn bậc ba."],
      th: ["Tính giá trị căn thức.", "Điều kiện xác định của căn thức."],
      vd: ["Biến đổi đơn giản căn thức (đưa thừa số ra ngoài/vào trong, trục căn).", "Rút gọn biểu thức chứa căn."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hàm số", "ax^2", "parabol"],
    topic: "Hàm số y = ax²",
    content: {
      nb: ["Tính đối xứng của đồ thị y=ax².", "Nhận biết Parabol."],
      th: ["Lập bảng giá trị.", "Sự biến thiên."],
      vd: ["Vẽ đồ thị Parabol.", "Tìm giao điểm của Parabol và đường thẳng."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["phương trình", "bậc hai", "viète", "viet"],
    topic: "Phương trình bậc hai một ẩn",
    content: {
      nb: ["Nhận biết phương trình bậc hai.", "Công thức nghiệm."],
      th: ["Tính nghiệm bằng máy tính.", "Định lí Viète."],
      vd: ["Giải phương trình bậc hai.", "Ứng dụng Viète (tổng/tích nghiệm).", "Giải bài toán bằng cách lập phương trình."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hệ phương trình"],
    topic: "Hệ phương trình bậc nhất hai ẩn",
    content: {
      nb: ["Nhận biết hệ phương trình bậc nhất 2 ẩn.", "Nghiệm của hệ."],
      th: ["Kiểm tra cặp số là nghiệm."],
      vd: ["Giải hệ phương trình (thế, cộng đại số).", "Giải toán bằng cách lập hệ phương trình."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hình trụ", "hình nón", "hình cầu"],
    topic: "Hình trụ - Nón - Cầu",
    content: {
      nb: ["Mô tả đường sinh, chiều cao, bán kính.", "Mặt cắt."],
      th: ["Công thức diện tích xung quanh, thể tích."],
      vd: ["Tính toán các đại lượng Sxq, V trong bài toán thực tế."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hệ thức lượng", "lượng giác", "sin", "cos"],
    topic: "Hệ thức lượng & Tỉ số lượng giác",
    content: {
      nb: ["Các tỉ số sin, cos, tan, cot.", "Hệ thức cạnh và đường cao."],
      th: ["Tỉ số lượng giác góc đặc biệt.", "Mối quan hệ cạnh và góc."],
      vd: ["Giải tam giác vuông.", "Tính chiều cao, khoảng cách thực tế."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["đường tròn", "góc", "tiếp tuyến"],
    topic: "Đường tròn",
    content: {
      nb: ["Tâm, bán kính, đường kính.", "Góc ở tâm, góc nội tiếp.", "Tiếp tuyến.", "Tứ giác nội tiếp."],
      th: ["Mối quan hệ đường kính và dây.", "Vị trí tương đối (đường thẳng-đường tròn, 2 đường tròn)."],
      vd: ["Chứng minh tiếp tuyến.", "Chứng minh tứ giác nội tiếp.", "Tính độ dài cung, diện tích hình quạt."]
    }
  }
];
