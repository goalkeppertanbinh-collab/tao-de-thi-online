
export interface CurriculumStandard {
  grade: string;
  keywords: string[]; // Keywords to match user input
  parentTopic: string; // Major Topic / Chapter (Chủ đề lớn)
  topic: string; // Sub-topic / Content (Chủ đề nhỏ)
  content: {
    nb: string[]; // Nhận biết
    th: string[]; // Thông hiểu
    vd: string[]; // Vận dụng (Low + High combined)
  };
}

export const CURRICULUM_DATA: CurriculumStandard[] = [
  // ================= LỚP 6 =================
  // --- Số tự nhiên ---
  {
    grade: "Lớp 6",
    keywords: ["số tự nhiên", "tập hợp", "số học"],
    parentTopic: "Số tự nhiên",
    topic: "Tập hợp các số tự nhiên",
    content: {
      nb: ["Nhận biết được tập hợp các số tự nhiên.", "Đọc và viết được các số tự nhiên.", "Nhận biết thứ tự trong tập hợp N."],
      th: ["Biểu diễn được số tự nhiên trong hệ thập phân.", "Biểu diễn số La Mã (1-30)."],
      vd: ["Sử dụng thuật ngữ tập hợp, phần tử thuộc/không thuộc."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["phép tính", "số tự nhiên", "lũy thừa", "số học"],
    parentTopic: "Số tự nhiên",
    topic: "Các phép tính với số tự nhiên",
    content: {
      nb: ["Nhận biết thứ tự thực hiện các phép tính.", "Quy tắc dấu ngoặc."],
      th: ["Thực hiện phép tính cộng, trừ, nhân, chia.", "Tính lũy thừa với số mũ tự nhiên."],
      vd: ["Vận dụng tính chất giao hoán, kết hợp, phân phối để tính nhanh.", "Giải quyết vấn đề thực tiễn đơn giản (mua sắm, tính tiền)."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["chia hết", "nguyên tố", "ước", "bội", "số học"],
    parentTopic: "Số tự nhiên",
    topic: "Tính chia hết & Số nguyên tố",
    content: {
      nb: ["Nhận biết quan hệ chia hết, khái niệm ước và bội.", "Nhận biết số nguyên tố, hợp số.", "Phép chia có dư."],
      th: ["Phân tích một số ra thừa số nguyên tố.", "Tìm ƯC, BC của hai số."],
      vd: ["Vận dụng dấu hiệu chia hết (2,3,5,9).", "Tìm ƯCLN, BCNN.", "Giải quyết bài toán chia đồ vật, xếp hàng."]
    }
  },
  // --- Số nguyên ---
  {
    grade: "Lớp 6",
    keywords: ["số nguyên", "âm", "z", "số học"],
    parentTopic: "Số nguyên",
    topic: "Số nguyên âm & Tập hợp Z",
    content: {
      nb: ["Nhận biết số nguyên âm, tập hợp số nguyên.", "Số đối của một số nguyên."],
      th: ["Biểu diễn số nguyên trên trục số.", "So sánh hai số nguyên.", "Ý nghĩa số nguyên âm trong thực tế (nhiệt độ, độ cao)."],
      vd: ["Sắp xếp thứ tự các số nguyên."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["số nguyên", "phép tính", "số học"],
    parentTopic: "Số nguyên",
    topic: "Các phép tính với số nguyên",
    content: {
      nb: ["Quy tắc cộng/trừ/nhân hai số nguyên cùng dấu/khác dấu."],
      th: ["Thực hiện phép tính cộng, trừ, nhân, chia số nguyên.", "Tính chia hết trong tập số nguyên."],
      vd: ["Vận dụng quy tắc dấu ngoặc.", "Tính nhanh, tính hợp lý.", "Giải toán đố về số nguyên (lỗ lãi, nhiệt độ)."]
    }
  },
  // --- Hình học L6 ---
  {
    grade: "Lớp 6",
    keywords: ["hình học", "trực quan", "tam giác", "vuông", "lục giác"],
    parentTopic: "Các hình phẳng trong thực tiễn",
    topic: "Tam giác đều, Hình vuông, Lục giác đều",
    content: {
      nb: ["Nhận dạng tam giác đều, hình vuông, lục giác đều."],
      th: ["Mô tả yếu tố cơ bản (cạnh, góc, đường chéo).", "Vẽ hình bằng thước và compa."],
      vd: ["Tạo lập lục giác đều từ tam giác đều."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["hình học", "trực quan", "chữ nhật", "thoi", "bình hành", "thang cân"],
    parentTopic: "Các hình phẳng trong thực tiễn",
    topic: "HCN, Hình thoi, HBH, Hình thang cân",
    content: {
      nb: ["Nhận dạng hình chữ nhật, hình thoi, hình bình hành, hình thang cân."],
      th: ["Mô tả cạnh, góc, đường chéo.", "Vẽ hình bằng dụng cụ học tập."],
      vd: ["Tính chu vi và diện tích các hình học cơ bản.", "Giải quyết vấn đề thực tiễn (tính diện tích sàn, sân)."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["đối xứng", "trục", "tâm", "hình học"],
    parentTopic: "Tính đối xứng của hình phẳng",
    topic: "Hình có trục đối xứng & Tâm đối xứng",
    content: {
      nb: ["Nhận biết trục đối xứng của một hình.", "Nhận biết tâm đối xứng của một hình.", "Nhận ra tính đối xứng trong tự nhiên/thực tế."],
      th: ["Tìm được trục/tâm đối xứng của hình cơ bản."],
      vd: ["Vẽ hình đối xứng qua trục/tâm.", "Cắt giấy tạo hình có trục/tâm đối xứng."]
    }
  },

  // ================= LỚP 7 =================
  {
    grade: "Lớp 7",
    keywords: ["hữu tỉ", "tỉ lệ", "số học", "đại số"],
    parentTopic: "Số hữu tỉ",
    topic: "Tập hợp Q & Các phép tính",
    content: {
      nb: ["Nhận biết số hữu tỉ, số đối của số hữu tỉ.", "Tập hợp Q."],
      th: ["Biểu diễn số hữu tỉ trên trục số.", "Thứ tự trong tập hợp số hữu tỉ.", "Tính chất lũy thừa."],
      vd: ["Cộng, trừ, nhân, chia số hữu tỉ.", "Vận dụng quy tắc chuyển vế.", "Giải toán thực tiễn."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["số thực", "căn", "vô tỉ", "làm tròn", "số học"],
    parentTopic: "Số thực",
    topic: "Số vô tỉ & Căn bậc hai số học",
    content: {
      nb: ["Nhận biết số vô tỉ, số thực.", "Nhận biết căn bậc hai số học.", "Giá trị tuyệt đối."],
      th: ["Tính căn bậc hai số học của số chính phương.", "Làm tròn số với độ chính xác cho trước."],
      vd: ["So sánh các số thực.", "Giải bài toán về làm tròn số trong thực tế."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["hình học", "góc", "song song"],
    parentTopic: "Hình học phẳng",
    topic: "Góc & Đường thẳng song song",
    content: {
      nb: ["Nhận biết góc đối đỉnh, góc kề bù.", "Nhận biết tia phân giác.", "Nhận biết hai đường thẳng song song."],
      th: ["Tính chất hai đường thẳng song song (góc so le trong, đồng vị).", "Dấu hiệu nhận biết hai đường thẳng song song."],
      vd: ["Tính số đo góc dựa vào tính chất song song.", "Vẽ tia phân giác."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["tam giác", "bằng nhau", "hình học"],
    parentTopic: "Hình học phẳng",
    topic: "Tam giác bằng nhau",
    content: {
      nb: ["Tổng 3 góc trong tam giác.", "Khái niệm hai tam giác bằng nhau.", "Tam giác cân, tam giác đều."],
      th: ["Giải thích các trường hợp bằng nhau (c.c.c, c.g.c, g.c.g).", "Trường hợp bằng nhau của tam giác vuông."],
      vd: ["Chứng minh hai tam giác bằng nhau.", "Chứng minh cạnh/góc bằng nhau dựa vào tam giác bằng nhau."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["quan hệ", "cạnh", "góc", "đường đồng quy", "hình học"],
    parentTopic: "Hình học phẳng",
    topic: "Quan hệ giữa các yếu tố trong tam giác",
    content: {
      nb: ["Quan hệ giữa góc và cạnh đối diện.", "Bất đẳng thức tam giác.", "Các đường đồng quy (trung tuyến, phân giác...)."],
      th: ["Tính chất đường trung trực.", "Tính chất ba đường trung tuyến."],
      vd: ["Chứng minh ba điểm thẳng hàng.", "Bài toán về đường trung trực, trọng tâm."]
    }
  },

  // ================= LỚP 8 =================
  {
    grade: "Lớp 8",
    keywords: ["đa thức", "nhiều biến", "đại số"],
    parentTopic: "Biểu thức đại số",
    topic: "Đa thức nhiều biến",
    content: {
      nb: ["Nhận biết đơn thức, đa thức nhiều biến.", "Bậc của đa thức."],
      th: ["Thu gọn đa thức.", "Tính giá trị đa thức tại giá trị cho trước."],
      vd: ["Cộng, trừ, nhân, chia đa thức nhiều biến.", "Tìm bậc của đa thức sau khi thu gọn."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hằng đẳng thức", "đáng nhớ", "đại số"],
    parentTopic: "Biểu thức đại số",
    topic: "Hằng đẳng thức đáng nhớ",
    content: {
      nb: ["Nhận biết 7 hằng đẳng thức đáng nhớ."],
      th: ["Khai triển hằng đẳng thức.", "Viết biểu thức dưới dạng bình phương/lập phương."],
      vd: ["Vận dụng hằng đẳng thức để rút gọn biểu thức.", "Phân tích đa thức thành nhân tử."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["phân thức", "đại số"],
    parentTopic: "Biểu thức đại số",
    topic: "Phân thức đại số",
    content: {
      nb: ["Định nghĩa phân thức đại số.", "Điều kiện xác định của phân thức."],
      th: ["Tính chất cơ bản của phân thức.", "Quy đồng mẫu thức."],
      vd: ["Cộng, trừ, nhân, chia phân thức.", "Rút gọn biểu thức hữu tỉ."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hàm số", "bậc nhất", "đồ thị", "đại số"],
    parentTopic: "Hàm số và Đồ thị",
    topic: "Hàm số bậc nhất y = ax + b",
    content: {
      nb: ["Nhận biết hàm số bậc nhất.", "Hệ số góc a, tung độ gốc b."],
      th: ["Vẽ đồ thị hàm số bậc nhất.", "Tính chất đồng biến/nghịch biến."],
      vd: ["Tìm hệ số a, b khi biết đồ thị đi qua điểm.", "Xét vị trí tương đối của hai đường thẳng."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hình chóp", "hình khối", "hình học"],
    parentTopic: "Hình học trực quan",
    topic: "Hình chóp tam giác & Tứ giác đều",
    content: {
      nb: ["Mô tả đỉnh, mặt đáy, mặt bên, cạnh bên.", "Nhận dạng hình chóp đều."],
      th: ["Tạo lập hình chóp từ lưới.", "Công thức Sxq, V."],
      vd: ["Tính diện tích xung quanh, thể tích hình chóp trong thực tế."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["pythagore", "tứ giác", "thalès", "thales", "đồng dạng", "hình học"],
    parentTopic: "Hình học phẳng",
    topic: "Định lí Thalès & Tam giác đồng dạng",
    content: {
      nb: ["Phát biểu định lí Thalès.", "Định nghĩa hai tam giác đồng dạng."],
      th: ["Tính độ dài đoạn thẳng dùng Thalès.", "Các trường hợp đồng dạng của tam giác."],
      vd: ["Chứng minh hai tam giác đồng dạng.", "Ứng dụng thực tế (đo chiều cao, khoảng cách)."]
    }
  },

  // ================= LỚP 9 =================
  {
    grade: "Lớp 9",
    keywords: ["căn thức", "căn bậc", "đại số"],
    parentTopic: "Căn thức",
    topic: "Căn thức bậc hai & Căn bậc ba",
    content: {
      nb: ["Định nghĩa căn bậc hai số học.", "Căn bậc ba.", "Điều kiện xác định của căn thức."],
      th: ["Tính giá trị biểu thức chứa căn.", "Khai phương một tích/thương."],
      vd: ["Biến đổi đơn giản: đưa thừa số ra ngoài/vào trong dấu căn.", "Trục căn thức ở mẫu.", "Rút gọn biểu thức chứa căn."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hàm số", "ax^2", "parabol", "đại số"],
    parentTopic: "Hàm số và Đồ thị",
    topic: "Hàm số y = ax² (a ≠ 0)",
    content: {
      nb: ["Tính đối xứng của đồ thị y=ax².", "Nhận dạng Parabol."],
      th: ["Lập bảng giá trị.", "Vẽ đồ thị hàm số y=ax²."],
      vd: ["Tìm giao điểm của Parabol và đường thẳng.", "Biện luận số giao điểm."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["phương trình", "bậc hai", "viète", "viet", "đại số"],
    parentTopic: "Phương trình và Hệ phương trình",
    topic: "Phương trình bậc hai một ẩn",
    content: {
      nb: ["Nhận dạng phương trình bậc hai.", "Công thức nghiệm (Delta)."],
      th: ["Giải phương trình bậc hai.", "Định lí Viète."],
      vd: ["Tính nhẩm nghiệm.", "Tìm hai số khi biết tổng và tích.", "Giải bài toán bằng cách lập phương trình bậc hai."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hệ phương trình", "bậc nhất", "đại số"],
    parentTopic: "Phương trình và Hệ phương trình",
    topic: "Hệ phương trình bậc nhất hai ẩn",
    content: {
      nb: ["Nhận biết hệ phương trình bậc nhất 2 ẩn.", "Cặp số là nghiệm của hệ."],
      th: ["Giải hệ bằng phương pháp thế.", "Giải hệ bằng phương pháp cộng đại số."],
      vd: ["Giải bài toán bằng cách lập hệ phương trình (chuyển động, năng suất)."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hệ thức lượng", "lượng giác", "sin", "cos", "hình học"],
    parentTopic: "Hình học phẳng",
    topic: "Hệ thức lượng trong tam giác vuông",
    content: {
      nb: ["Các tỉ số lượng giác (sin, cos, tan, cot).", "Hệ thức giữa cạnh và đường cao."],
      th: ["Tính tỉ số lượng giác góc đặc biệt.", "Giải tam giác vuông (tìm cạnh/góc chưa biết)."],
      vd: ["Ứng dụng thực tế: tính chiều cao cây, tháp, khoảng cách không đo được trực tiếp."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["đường tròn", "tiếp tuyến", "góc", "hình học"],
    parentTopic: "Đường tròn",
    topic: "Đường tròn & Góc với đường tròn",
    content: {
      nb: ["Tâm, bán kính, đường kính, dây cung.", "Tiếp tuyến của đường tròn.", "Góc ở tâm, góc nội tiếp."],
      th: ["Tính chất hai tiếp tuyến cắt nhau.", "Quan hệ vuông góc giữa đường kính và dây.", "Liên hệ giữa cung và dây."],
      vd: ["Chứng minh tiếp tuyến.", "Chứng minh tứ giác nội tiếp.", "Bài toán tổng hợp về đường tròn."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hình trụ", "hình nón", "hình cầu", "hình học"],
    parentTopic: "Hình học trực quan",
    topic: "Hình trụ - Hình nón - Hình cầu",
    content: {
      nb: ["Nhận dạng hình trụ, nón, cầu.", "Các yếu tố: đường sinh, chiều cao, bán kính."],
      th: ["Công thức diện tích xung quanh.", "Công thức thể tích."],
      vd: ["Tính toán Sxq, V trong các bài toán thực tế (bể nước, chi tiết máy)."]
    }
  }
];
