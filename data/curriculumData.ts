
export interface CurriculumStandard {
  grade: string;
  keywords: string[]; // Keywords to match user input
  parentTopic: string; // Major Topic / Chapter (Chủ đề lớn)
  topic: string; // Sub-topic / Content (Chủ đề nhỏ / Nội dung kiến thức)
  content: {
    nb: string[]; // Nhận biết
    th: string[]; // Thông hiểu
    vd: string[]; // Vận dụng (Low + High combined)
  };
}

export const CURRICULUM_DATA: CurriculumStandard[] = [
  // ================= LỚP 6 =================
  // --- Số và Đại số ---
  {
    grade: "Lớp 6",
    keywords: ["số tự nhiên", "tập hợp"],
    parentTopic: "Số tự nhiên",
    topic: "Số tự nhiên và tập hợp các số tự nhiên",
    content: {
      nb: ["Nhận biết được tập hợp các số tự nhiên.", "Đọc, viết số tự nhiên."],
      th: ["Biểu diễn số tự nhiên trong hệ thập phân.", "Biểu diễn các số từ 1 đến 30 bằng chữ số La Mã."],
      vd: ["Sử dụng thuật ngữ tập hợp, phần tử thuộc/không thuộc."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["phép tính", "số tự nhiên", "lũy thừa"],
    parentTopic: "Số tự nhiên",
    topic: "Các phép tính với số tự nhiên",
    content: {
      nb: ["Nhận biết thứ tự thực hiện các phép tính."],
      th: ["Thực hiện phép cộng, trừ, nhân, chia.", "Tính lũy thừa với số mũ tự nhiên.", "Nhân/chia hai lũy thừa cùng cơ số."],
      vd: ["Vận dụng tính chất giao hoán, kết hợp, phân phối.", "Giải quyết vấn đề thực tiễn đơn giản (tính tiền)."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["chia hết", "nguyên tố", "ước", "bội", "ucln", "bcnn"],
    parentTopic: "Số tự nhiên",
    topic: "Tính chia hết & Số nguyên tố",
    content: {
      nb: ["Nhận biết quan hệ chia hết, ước và bội.", "Nhận biết số nguyên tố, hợp số.", "Phép chia có dư, phân số tối giản."],
      th: ["Phân tích số ra thừa số nguyên tố."],
      vd: ["Vận dụng dấu hiệu chia hết (2,3,5,9).", "Tìm ƯCLN, BCNN.", "Giải quyết bài toán thực tiễn về chia nhóm, xếp hàng."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["số nguyên", "âm", "trục số"],
    parentTopic: "Số nguyên",
    topic: "Số nguyên âm & Tập hợp số nguyên",
    content: {
      nb: ["Nhận biết số nguyên âm, tập hợp Z.", "Số đối của một số nguyên.", "Thứ tự trong tập số nguyên."],
      th: ["Biểu diễn số nguyên trên trục số.", "So sánh hai số nguyên."],
      vd: ["Nhận biết ý nghĩa số nguyên âm trong thực tế (nhiệt độ, độ cao)."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["số nguyên", "phép tính", "quy tắc dấu"],
    parentTopic: "Số nguyên",
    topic: "Các phép tính với số nguyên",
    content: {
      nb: ["Nhận biết quan hệ chia hết trong tập số nguyên."],
      th: ["Thực hiện cộng, trừ, nhân, chia số nguyên."],
      vd: ["Vận dụng quy tắc dấu ngoặc.", "Tính nhanh hợp lý.", "Giải toán thực tiễn (lỗ lãi, nhiệt độ)."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["phân số", "tính chất", "so sánh"],
    parentTopic: "Phân số",
    topic: "Phân số & Tính chất cơ bản",
    content: {
      nb: ["Nhận biết phân số (tử/mẫu nguyên).", "Hai phân số bằng nhau.", "Số đối của phân số, hỗn số dương."],
      th: ["So sánh hai phân số.", "Nêu tính chất cơ bản của phân số."],
      vd: ["Rút gọn phân số.", "Quy đồng mẫu số."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["phân số", "phép tính"],
    parentTopic: "Phân số",
    topic: "Các phép tính với phân số",
    content: {
      nb: [],
      th: ["Thực hiện cộng, trừ, nhân, chia phân số."],
      vd: ["Vận dụng tính chất phép tính để tính nhanh.", "Tính giá trị phân số của một số.", "Tìm một số biết giá trị phân số của nó.", "Giải toán chuyển động, công việc chung."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["số thập phân", "tỉ số phần trăm"],
    parentTopic: "Số thập phân",
    topic: "Số thập phân & Các phép tính",
    content: {
      nb: ["Nhận biết số thập phân âm, số đối.", "Tỉ số và tỉ số phần trăm."],
      th: ["So sánh hai số thập phân.", "Làm tròn số thập phân."],
      vd: ["Thực hiện 4 phép tính số thập phân.", "Tính giá trị phần trăm của một số.", "Giải toán thực tiễn (lãi suất, thành phần hóa học)."]
    }
  },
  // --- Hình học L6 ---
  {
    grade: "Lớp 6",
    keywords: ["hình học", "trực quan", "tam giác đều", "lục giác đều"],
    parentTopic: "Hình học trực quan",
    topic: "Các hình phẳng cơ bản",
    content: {
      nb: ["Nhận dạng tam giác đều, hình vuông, lục giác đều."],
      th: ["Mô tả cạnh, góc, đường chéo của tam giác đều, hình vuông, lục giác đều."],
      vd: ["Vẽ tam giác đều, hình vuông.", "Tạo lập lục giác đều từ tam giác đều."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["hcn", "thoi", "bình hành", "thang cân"],
    parentTopic: "Hình học trực quan",
    topic: "HCN - Hình thoi - HBH - Thang cân",
    content: {
      nb: ["Nhận dạng hình chữ nhật, thoi, bình hành, thang cân."],
      th: ["Mô tả cạnh, góc, đường chéo các hình này.", "Vẽ hình bằng thước và êke."],
      vd: ["Tính chu vi và diện tích các hình này trong thực tiễn."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["đối xứng", "trục", "tâm"],
    parentTopic: "Hình học trực quan",
    topic: "Tính đối xứng của hình phẳng",
    content: {
      nb: ["Nhận biết trục đối xứng, tâm đối xứng của một hình.", "Nhận biết tính đối xứng trong tự nhiên."],
      th: ["Tìm trục/tâm đối xứng của các hình học cơ bản."],
      vd: ["Gấp giấy, cắt hình có tính đối xứng."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["hình học phẳng", "điểm", "đường thẳng", "góc"],
    parentTopic: "Hình học phẳng",
    topic: "Các hình hình học cơ bản",
    content: {
      nb: ["Điểm thuộc/không thuộc đường thẳng.", "Ba điểm thẳng hàng.", "Tia, đoạn thẳng, trung điểm.", "Góc, đỉnh, cạnh của góc.", "Góc vuông, nhọn, tù, bẹt."],
      th: ["Đo độ dài đoạn thẳng.", "Đo góc."],
      vd: ["Vẽ đoạn thẳng, góc với số đo cho trước."]
    }
  },
  // --- Thống kê L6 ---
  {
    grade: "Lớp 6",
    keywords: ["thống kê", "dữ liệu", "biểu đồ"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Thu thập và tổ chức dữ liệu",
    content: {
      nb: ["Đọc dữ liệu từ bảng thống kê, biểu đồ tranh, biểu đồ cột."],
      th: ["Mô tả dữ liệu từ bảng/biểu đồ.", "Nhận biết tính hợp lý của dữ liệu."],
      vd: ["Thu thập, phân loại dữ liệu.", "Lập bảng thống kê, vẽ biểu đồ cột đơn/kép."]
    }
  },
  {
    grade: "Lớp 6",
    keywords: ["xác suất", "thực nghiệm"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Một số yếu tố xác suất",
    content: {
      nb: ["Làm quen mô hình xác suất đơn giản (tung xu, xúc xắc)."],
      th: ["Mô tả khả năng xảy ra (có thể, chắc chắn, không thể)."],
      vd: ["Kiểm đếm số lần xuất hiện sự kiện trong trò chơi đơn giản."]
    }
  },

  // ================= LỚP 7 =================
  // --- Số và Đại số ---
  {
    grade: "Lớp 7",
    keywords: ["hữu tỉ", "q"],
    parentTopic: "Số hữu tỉ",
    topic: "Số hữu tỉ và tập hợp Q",
    content: {
      nb: ["Nhận biết số hữu tỉ, số đối.", "Tập hợp Q."],
      th: ["Biểu diễn số hữu tỉ trên trục số.", "So sánh số hữu tỉ.", "Mô tả lũy thừa số mũ tự nhiên."],
      vd: ["Cộng, trừ, nhân, chia số hữu tỉ.", "Tính chất phân phối, giao hoán.", "Giải bài toán thực tiễn."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["số thực", "căn", "vô tỉ"],
    parentTopic: "Số thực",
    topic: "Số vô tỉ & Căn bậc hai số học",
    content: {
      nb: ["Nhận biết số vô tỉ, số thực.", "Căn bậc hai số học.", "Giá trị tuyệt đối."],
      th: ["Tính căn bậc hai số học của số dương.", "Làm tròn số."],
      vd: ["So sánh số thực.", "Giải bài toán về làm tròn trong đo đạc."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["tỉ lệ thức", "dãy tỉ số"],
    parentTopic: "Số thực",
    topic: "Tỉ lệ thức & Dãy tỉ số bằng nhau",
    content: {
      nb: ["Nhận biết tỉ lệ thức, dãy tỉ số bằng nhau."],
      th: ["Tính chất tỉ lệ thức."],
      vd: ["Tìm x, y trong dãy tỉ số.", "Giải bài toán chia tỉ lệ (tổng sản phẩm, năng suất)."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["đại số", "biểu thức"],
    parentTopic: "Biểu thức đại số",
    topic: "Biểu thức đại số",
    content: {
      nb: ["Nhận biết biểu thức số, biểu thức đại số."],
      th: ["Tính giá trị biểu thức đại số."],
      vd: ["Bài toán thực tiễn dùng biểu thức đại số."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["đa thức", "một biến"],
    parentTopic: "Biểu thức đại số",
    topic: "Đa thức một biến",
    content: {
      nb: ["Định nghĩa đa thức một biến.", "Nghiệm của đa thức."],
      th: ["Xác định bậc của đa thức.", "Sắp xếp đa thức."],
      vd: ["Cộng, trừ, nhân, chia đa thức một biến."]
    }
  },
  // --- Hình học L7 ---
  {
    grade: "Lớp 7",
    keywords: ["hình khối", "hộp chữ nhật", "lăng trụ"],
    parentTopic: "Hình học trực quan",
    topic: "Các hình khối trong thực tiễn",
    content: {
      nb: ["Mô tả đỉnh, cạnh, mặt của HHCN, Hình lập phương, Lăng trụ đứng tam giác/tứ giác."],
      th: ["Tạo lập các hình khối từ tấm bìa."],
      vd: ["Tính diện tích xung quanh, thể tích các hình khối này."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["góc", "song song", "tiên đề euclid"],
    parentTopic: "Hình học phẳng",
    topic: "Góc & Đường thẳng song song",
    content: {
      nb: ["Góc đối đỉnh, kề bù.", "Tia phân giác.", "Tiên đề Euclid."],
      th: ["Tính chất hai đường thẳng song song (so le trong, đồng vị).", "Dấu hiệu nhận biết song song."],
      vd: ["Tính số đo góc.", "Vẽ tia phân giác.", "Chứng minh định lí đơn giản."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["tam giác", "bằng nhau"],
    parentTopic: "Hình học phẳng",
    topic: "Tam giác bằng nhau",
    content: {
      nb: ["Tổng 3 góc trong tam giác.", "Hai tam giác bằng nhau."],
      th: ["Các trường hợp bằng nhau (c.c.c, c.g.c, g.c.g).", "Tam giác cân (tính chất)."],
      vd: ["Chứng minh hai tam giác bằng nhau.", "Chứng minh cạnh/góc bằng nhau.", "Bài toán thực tế đo đạc."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["quan hệ", "đường đồng quy"],
    parentTopic: "Hình học phẳng",
    topic: "Quan hệ yếu tố trong tam giác & Đồng quy",
    content: {
      nb: ["Quan hệ góc và cạnh đối diện.", "Đường vuông góc và đường xiên.", "Các đường đặc biệt (trung tuyến, phân giác, cao, trung trực)."],
      th: ["Bất đẳng thức tam giác.", "Tính chất trọng tâm, trực tâm."],
      vd: ["Chứng minh 3 điểm thẳng hàng, đường đồng quy."]
    }
  },
  // --- Thống kê L7 ---
  {
    grade: "Lớp 7",
    keywords: ["thống kê", "biểu đồ"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Thu thập & Biểu diễn dữ liệu",
    content: {
      nb: ["Tính hợp lý của dữ liệu."],
      th: ["Biểu đồ hình quạt tròn.", "Biểu đồ đoạn thẳng."],
      vd: ["Phân tích xu hướng dữ liệu.", "Giải quyết vấn đề dựa trên biểu đồ."]
    }
  },
  {
    grade: "Lớp 7",
    keywords: ["xác suất", "biến cố"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Xác suất của biến cố",
    content: {
      nb: ["Biến cố ngẫu nhiên.", "Xác suất của biến cố trong trò chơi đơn giản."],
      th: ["So sánh xác suất của các biến cố."],
      vd: ["Tính xác suất thực nghiệm."]
    }
  },

  // ================= LỚP 8 =================
  // --- Đại số ---
  {
    grade: "Lớp 8",
    keywords: ["biểu thức", "đa thức", "nhiều biến"],
    parentTopic: "Biểu thức đại số",
    topic: "Đa thức nhiều biến",
    content: {
      nb: ["Nhận biết đơn thức, đa thức nhiều biến."],
      th: ["Tính giá trị đa thức khi biết giá trị của biến."],
      vd: ["Thu gọn đơn thức, đa thức.", "Cộng, trừ, nhân, chia đa thức nhiều biến (trường hợp đơn giản)."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hằng đẳng thức"],
    parentTopic: "Biểu thức đại số",
    topic: "Hằng đẳng thức đáng nhớ",
    content: {
      nb: ["Nhận biết đồng nhất thức, hằng đẳng thức."],
      th: ["Mô tả các hằng đẳng thức (bình phương tổng/hiệu, hiệu hai bình phương...)."],
      vd: ["Vận dụng hằng đẳng thức để phân tích đa thức thành nhân tử.", "Tính nhanh."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["phân thức"],
    parentTopic: "Biểu thức đại số",
    topic: "Phân thức đại số",
    content: {
      nb: ["Nhận biết phân thức đại số, điều kiện xác định.", "Hai phân thức bằng nhau."],
      th: ["Mô tả tính chất cơ bản của phân thức."],
      vd: ["Thực hiện cộng, trừ, nhân, chia phân thức.", "Rút gọn biểu thức hữu tỉ.", "Tính giá trị phân thức."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hàm số", "đồ thị"],
    parentTopic: "Hàm số và đồ thị",
    topic: "Hàm số và đồ thị",
    content: {
      nb: ["Nhận biết mô hình thực tế dẫn đến hàm số.", "Nhận biết đồ thị hàm số."],
      th: ["Tính giá trị hàm số.", "Xác định toạ độ điểm trên mặt phẳng."],
      vd: []
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["hàm số", "bậc nhất", "y=ax+b"],
    parentTopic: "Hàm số và đồ thị",
    topic: "Hàm số bậc nhất y = ax + b",
    content: {
      nb: ["Nhận biết hệ số góc của đường thẳng."],
      th: ["Thiết lập bảng giá trị.", "Sử dụng hệ số góc nhận biết cắt nhau/song song."],
      vd: ["Vẽ đồ thị hàm số bậc nhất.", "Giải quyết bài toán thực tiễn (chuyển động, giá cả)."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["phương trình", "bậc nhất"],
    parentTopic: "Phương trình",
    topic: "Phương trình bậc nhất một ẩn",
    content: {
      nb: [],
      th: ["Mô tả phương trình bậc nhất một ẩn và cách giải."],
      vd: ["Giải phương trình bậc nhất một ẩn.", "Giải toán thực tiễn bằng cách lập phương trình (chuyển động, hoá học...)."]
    }
  },
  // --- Hình học L8 ---
  {
    grade: "Lớp 8",
    keywords: ["hình chóp", "đa diện"],
    parentTopic: "Hình học trực quan",
    topic: "Hình chóp tam giác đều & Tứ giác đều",
    content: {
      nb: ["Mô tả đỉnh, mặt đáy, mặt bên, cạnh bên."],
      th: ["Tạo lập hình chóp.", "Tính diện tích xung quanh, thể tích."],
      vd: ["Giải quyết vấn đề thực tiễn liên quan đến hình chóp."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["pythagore"],
    parentTopic: "Hình học phẳng",
    topic: "Định lí Pythagore",
    content: {
      nb: [],
      th: ["Giải thích định lí Pythagore."],
      vd: ["Tính độ dài cạnh trong tam giác vuông.", "Giải quyết vấn đề thực tiễn (khoảng cách)."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["tứ giác"],
    parentTopic: "Hình học phẳng",
    topic: "Tứ giác & Các tứ giác đặc biệt",
    content: {
      nb: ["Mô tả tứ giác lồi.", "Nhận biết dấu hiệu hình thang cân, HBH, HCN, Thoi, Vuông."],
      th: ["Giải thích định lí tổng các góc tứ giác.", "Giải thích tính chất đường chéo, cạnh, góc của các hình đặc biệt."],
      vd: []
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["thales", "trung bình"],
    parentTopic: "Hình học phẳng",
    topic: "Định lí Thalès trong tam giác",
    content: {
      nb: ["Nhận biết đường trung bình của tam giác."],
      th: ["Giải thích tính chất đường trung bình.", "Giải thích định lí Thalès (thuận/đảo).", "Tính chất đường phân giác."],
      vd: ["Tính độ dài đoạn thẳng dùng Thalès.", "Giải quyết vấn đề thực tiễn (đo đạc)."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["đồng dạng"],
    parentTopic: "Hình học phẳng",
    topic: "Hình đồng dạng",
    content: {
      nb: ["Nhận biết hình đồng dạng phối cảnh (vị tự)."],
      th: ["Mô tả định nghĩa tam giác đồng dạng.", "Giải thích các trường hợp đồng dạng."],
      vd: ["Giải quyết vấn đề thực tiễn (đo gián tiếp, khoảng cách)."]
    }
  },
  // --- Thống kê L8 ---
  {
    grade: "Lớp 8",
    keywords: ["thống kê", "dữ liệu"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Thu thập và tổ chức dữ liệu",
    content: {
      nb: [],
      th: ["Giải thích tính hợp lí của dữ liệu.", "Mô tả cách chuyển dữ liệu giữa các dạng biểu diễn."],
      vd: ["Thực hiện thu thập, phân loại dữ liệu từ nhiều nguồn.", "Chứng tỏ tính hợp lí của dữ liệu."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["phân tích", "biểu đồ"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Phân tích và xử lí dữ liệu",
    content: {
      nb: ["Nhận biết mối liên quan giữa thống kê và các môn học khác."],
      th: ["Phát hiện vấn đề/quy luật đơn giản từ bảng/biểu đồ."],
      vd: ["Giải quyết vấn đề đơn giản liên quan đến số liệu (biểu đồ cột, quạt, đoạn thẳng)."]
    }
  },
  {
    grade: "Lớp 8",
    keywords: ["xác suất"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Một số yếu tố xác suất",
    content: {
      nb: ["Nhận biết mối liên hệ giữa xác suất thực nghiệm và xác suất lý thuyết."],
      th: [],
      vd: ["Sử dụng tỉ số để mô tả xác suất của biến cố trong ví dụ đơn giản."]
    }
  },

  // ================= LỚP 9 =================
  // --- Đại số ---
  {
    grade: "Lớp 9",
    keywords: ["căn thức", "căn bậc hai"],
    parentTopic: "Căn thức",
    topic: "Căn bậc hai và căn bậc ba của số thực",
    content: {
      nb: ["Nhận biết khái niệm căn bậc hai, căn bậc ba."],
      th: ["Tính giá trị căn bậc hai/ba bằng máy tính."],
      vd: ["Thực hiện phép tính đơn giản về căn bậc hai (nhân, chia, đưa thừa số)."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["căn thức", "đại số"],
    parentTopic: "Căn thức",
    topic: "Căn thức bậc hai và căn thức bậc ba của biểu thức đại số",
    content: {
      nb: ["Nhận biết căn thức bậc hai/ba của biểu thức đại số."],
      th: [],
      vd: ["Biến đổi đơn giản căn thức đại số (trục căn thức ở mẫu, khai phương tích/thương)."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hàm số", "parabol", "bậc hai"],
    parentTopic: "Hàm số và đồ thị",
    topic: "Hàm số y = ax² (a ≠ 0) và đồ thị",
    content: {
      nb: ["Nhận biết tính đối xứng (trục) của Parabol."],
      th: ["Thiết lập bảng giá trị."],
      vd: ["Vẽ đồ thị hàm số y = ax².", "Giải quyết vấn đề thực tiễn (chuyển động, quỹ đạo)."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["phương trình", "bậc nhất", "tích"],
    parentTopic: "Phương trình và hệ phương trình",
    topic: "Phương trình quy về phương trình bậc nhất một ẩn",
    content: {
      nb: [],
      th: [],
      vd: ["Giải phương trình tích dạng (ax+b)(cx+d)=0.", "Giải phương trình chứa ẩn ở mẫu quy về bậc nhất."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["hệ phương trình", "hai ẩn"],
    parentTopic: "Phương trình và hệ phương trình",
    topic: "Phương trình và hệ phương trình bậc nhất hai ẩn",
    content: {
      nb: ["Nhận biết phương trình bậc nhất 2 ẩn.", "Nhận biết nghiệm của hệ phương trình."],
      th: ["Tính nghiệm hệ phương trình bằng máy tính cầm tay."],
      vd: ["Giải hệ hai phương trình bậc nhất hai ẩn.", "Giải toán thực tiễn bằng cách lập hệ phương trình (cân bằng phản ứng, toán đố)."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["phương trình", "bậc hai", "viète"],
    parentTopic: "Phương trình và hệ phương trình",
    topic: "Phương trình bậc hai một ẩn & Định lí Viète",
    content: {
      nb: ["Nhận biết phương trình bậc hai một ẩn."],
      th: ["Tính nghiệm bằng máy tính cầm tay.", "Giải thích định lí Viète."],
      vd: ["Giải phương trình bậc hai một ẩn.", "Ứng dụng Viète tính nhẩm nghiệm, tìm hai số.", "Giải toán thực tiễn bằng phương trình bậc hai."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["bất phương trình", "bất đẳng thức"],
    parentTopic: "Bất phương trình bậc nhất một ẩn",
    topic: "Bất đẳng thức & Bất phương trình bậc nhất một ẩn",
    content: {
      nb: ["Nhận biết thứ tự trên tập số thực.", "Nhận biết bất đẳng thức.", "Nhận biết BPT bậc nhất 1 ẩn."],
      th: ["Mô tả tính chất cơ bản của bất đẳng thức (bắc cầu, cộng, nhân)."],
      vd: ["Giải bất phương trình bậc nhất một ẩn."]
    }
  },
  // --- Hình học L9 ---
  {
    grade: "Lớp 9",
    keywords: ["hình trụ", "nón", "cầu"],
    parentTopic: "Hình học trực quan",
    topic: "Các hình khối: Trụ - Nón - Cầu",
    content: {
      nb: ["Mô tả hình trụ, nón, cầu (đường sinh, chiều cao, bán kính, tâm).", "Nhận biết phần chung mặt phẳng và hình cầu."],
      th: ["Tạo lập hình trụ, nón, cầu.", "Tính diện tích xung quanh, thể tích."],
      vd: ["Giải quyết vấn đề thực tiễn liên quan đến Sxq, V của các hình này."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["lượng giác", "hệ thức lượng"],
    parentTopic: "Hệ thức lượng trong tam giác vuông",
    topic: "Hệ thức lượng & Tỉ số lượng giác",
    content: {
      nb: ["Nhận biết sin, cos, tan, cot."],
      th: ["Giải thích tỉ số lượng giác góc đặc biệt (30, 45, 60).", "Giải thích hệ thức cạnh và đường cao.", "Tính tỉ số lượng giác bằng máy tính."],
      vd: ["Giải quyết vấn đề thực tiễn (đo chiều cao, khoảng cách, giải tam giác vuông)."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["đường tròn", "vị trí"],
    parentTopic: "Đường tròn",
    topic: "Đường tròn & Vị trí tương đối",
    content: {
      nb: ["Nhận biết tâm, trục đối xứng của đường tròn."],
      th: ["Mô tả 3 vị trí tương đối của 2 đường tròn.", "Mô tả 3 vị trí tương đối đường thẳng và đường tròn.", "Dấu hiệu nhận biết tiếp tuyến."],
      vd: ["So sánh độ dài đường kính và dây."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["góc", "đường tròn"],
    parentTopic: "Đường tròn",
    topic: "Góc ở tâm & Góc nội tiếp",
    content: {
      nb: ["Nhận biết góc ở tâm, góc nội tiếp."],
      th: ["Giải thích mối liên hệ cung và góc ở tâm, góc nội tiếp."],
      vd: []
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["nội tiếp", "ngoại tiếp", "tứ giác"],
    parentTopic: "Đường tròn",
    topic: "Đường tròn ngoại tiếp & Tứ giác nội tiếp",
    content: {
      nb: ["Nhận biết đường tròn ngoại/nội tiếp tam giác.", "Nhận biết tứ giác nội tiếp."],
      th: ["Giải thích tổng 2 góc đối tứ giác nội tiếp = 180 độ.", "Xác định tâm đường tròn ngoại tiếp hình chữ nhật/vuông."],
      vd: ["Tính độ dài cung tròn, diện tích hình quạt, hình vành khuyên.", "Xác định tâm/bán kính đường tròn ngoại/nội tiếp tam giác.", "Giải quyết vấn đề thực tiễn liên quan (chuyển động tròn, diện tích)."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["đa giác đều", "phép quay"],
    parentTopic: "Đa giác đều",
    topic: "Đa giác đều & Phép quay",
    content: {
      nb: ["Nhận dạng đa giác đều.", "Nhận biết phép quay.", "Vẻ đẹp tính đều trong tự nhiên."],
      th: ["Mô tả phép quay giữ nguyên đa giác đều."],
      vd: []
    }
  },
  // --- Thống kê L9 ---
  {
    grade: "Lớp 9",
    keywords: ["thống kê", "tần số"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Thống kê: Thu thập và tổ chức dữ liệu",
    content: {
      nb: [],
      th: ["Lí giải và thiết lập dữ liệu vào bảng, biểu đồ thích hợp.", "Bảng thống kê, biểu đồ tranh, cột, quạt, đoạn thẳng."],
      vd: []
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["phân tích", "tần số"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Thống kê: Phân tích và xử lý dữ liệu",
    content: {
      nb: ["Nhận biết mối liên hệ thống kê với các môn khác."],
      th: ["Ý nghĩa của tần số, tần số tương đối."],
      vd: ["Xác định tần số, tần số tương đối.", "Thiết lập bảng tần số (ghép nhóm), biểu đồ tần số.", "Phát hiện số liệu không chính xác."]
    }
  },
  {
    grade: "Lớp 9",
    keywords: ["xác suất", "không gian mẫu"],
    parentTopic: "Thống kê và Xác suất",
    topic: "Xác suất: Phép thử & Biến cố",
    content: {
      nb: ["Nhận biết phép thử ngẫu nhiên, không gian mẫu."],
      th: [],
      vd: ["Tính xác suất bằng quy tắc đếm số trường hợp thuận lợi/có thể."]
    }
  }
];
