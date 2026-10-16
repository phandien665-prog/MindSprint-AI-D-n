// Dữ liệu 3000 từ vựng Oxford tiếng Anh theo chủ đề từ ZIM Academy
const OXFORD_VOCAB_DATA = [
  {
    "id": "oxford-1",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Watercolour",
    "answer": "Màu nước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔː.təˌkʌl.ər/",
    "status": "new"
  },
  {
    "id": "oxford-2",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Thumbtack",
    "answer": "Đinh ghim",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈθʌm.tæk/",
    "status": "new"
  },
  {
    "id": "oxford-3",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Textbook",
    "answer": "Sách giáo khoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtekst.bʊk/",
    "status": "new"
  },
  {
    "id": "oxford-4",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Test Tube",
    "answer": "Ống nghiệm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtest ˌtjuːb/",
    "status": "new"
  },
  {
    "id": "oxford-5",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Tape measure",
    "answer": "Thước dây",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈteɪp ˌmeʒ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-6",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Stencil",
    "answer": "Giấy nến",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsten.səl/",
    "status": "new"
  },
  {
    "id": "oxford-7",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Stapler",
    "answer": "Đồ dập ghim",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsteɪ.plər/",
    "status": "new"
  },
  {
    "id": "oxford-8",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Staple remover",
    "answer": "Cái gỡ ghim bấm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsteɪ.plər rɪˈmuː.vər/",
    "status": "new"
  },
  {
    "id": "oxford-9",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Set Square",
    "answer": "Ê-ke",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈset ˌskweər/",
    "status": "new"
  },
  {
    "id": "oxford-10",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Scotch Tape",
    "answer": "Băng dính trong suốt",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌskɒtʃ ˈteɪp/",
    "status": "new"
  },
  {
    "id": "oxford-11",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Scissors",
    "answer": "Kéo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɪz.əz/",
    "status": "new"
  },
  {
    "id": "oxford-12",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Ruler",
    "answer": "Thước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈruː.lər/",
    "status": "new"
  },
  {
    "id": "oxford-13",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Ribbon",
    "answer": "Ruy-băng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrɪb.ən/",
    "status": "new"
  },
  {
    "id": "oxford-14",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Protractor",
    "answer": "Thước đo góc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /prəˈtræk.tər/",
    "status": "new"
  },
  {
    "id": "oxford-15",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Post-it note",
    "answer": "Giấy nhớ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpəʊst.ɪt ˌnəʊt/",
    "status": "new"
  },
  {
    "id": "oxford-16",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Pin",
    "answer": "Đinh ghim, kẹp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɪn/",
    "status": "new"
  },
  {
    "id": "oxford-17",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Pencil",
    "answer": "Bút chì",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpen.səl/",
    "status": "new"
  },
  {
    "id": "oxford-18",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Pencil Sharpener",
    "answer": "Đồ gọt bút chì",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpen.səl ˌʃɑː.pən.ər/",
    "status": "new"
  },
  {
    "id": "oxford-19",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Pencil Case",
    "answer": "Hộp bút",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpen.səl ˌkeɪs/",
    "status": "new"
  },
  {
    "id": "oxford-20",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Pen",
    "answer": "Bút mực",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pen/",
    "status": "new"
  },
  {
    "id": "oxford-21",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Paper",
    "answer": "Giấy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpeɪ.pər/",
    "status": "new"
  },
  {
    "id": "oxford-22",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Paper fastener",
    "answer": "Dụng cụ kẹp giấy",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpeɪ.pər ˈfɑːs.ən.ər/",
    "status": "new"
  },
  {
    "id": "oxford-23",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Paper Clip",
    "answer": "Kẹp giấy",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpeɪ.pə ˌklɪp/",
    "status": "new"
  },
  {
    "id": "oxford-24",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Palette",
    "answer": "Bảng màu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpæl.ət/",
    "status": "new"
  },
  {
    "id": "oxford-25",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Paint",
    "answer": "Sơn, màu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /peɪnt/",
    "status": "new"
  },
  {
    "id": "oxford-26",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Paintbrush",
    "answer": "Chổi sơn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpeɪntˌbrʌʃ/",
    "status": "new"
  },
  {
    "id": "oxford-27",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Notebook",
    "answer": "Cuốn sổ, vở",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnəʊt.bʊk/",
    "status": "new"
  },
  {
    "id": "oxford-28",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Map",
    "answer": "Bản đồ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mæp/",
    "status": "new"
  },
  {
    "id": "oxford-29",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Magnifying Glass",
    "answer": "Kính lúp",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmæɡ.nɪ.faɪ.ɪŋ ˌɡlɑːs/",
    "status": "new"
  },
  {
    "id": "oxford-30",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Index card",
    "answer": "Phiếu làm mục lục",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɑːd ˌɪn.deks/",
    "status": "new"
  },
  {
    "id": "oxford-31",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Highlighter",
    "answer": "Bút đánh dấu màu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhaɪˌlaɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-32",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Glue",
    "answer": "Keo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡluː/",
    "status": "new"
  },
  {
    "id": "oxford-33",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Globe",
    "answer": "Quả địa cầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡləʊb/",
    "status": "new"
  },
  {
    "id": "oxford-34",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Flash card",
    "answer": "Thẻ ghi nhớ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈflæʃ ˌkɑːd/",
    "status": "new"
  },
  {
    "id": "oxford-35",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "File Holder",
    "answer": "Tập hồ sơ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /faɪlˈhəʊl.dər/",
    "status": "new"
  },
  {
    "id": "oxford-36",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "File cabinet",
    "answer": "Tủ đựng tài liệu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfaɪl ˌkæb.ɪ.nət/",
    "status": "new"
  },
  {
    "id": "oxford-37",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Felt pen",
    "answer": "Bút dạ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /felt pen/",
    "status": "new"
  },
  {
    "id": "oxford-38",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Rubber",
    "answer": "Cục tẩy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrʌb.ər/",
    "status": "new"
  },
  {
    "id": "oxford-39",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Duster",
    "answer": "Khăn lau bảng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʌs.tər/",
    "status": "new"
  },
  {
    "id": "oxford-40",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Dossier",
    "answer": "Hồ sơ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɒs.i.eɪ/",
    "status": "new"
  },
  {
    "id": "oxford-41",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Dictionary",
    "answer": "Từ điển",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈdɪk.ʃən.ər.i/",
    "status": "new"
  },
  {
    "id": "oxford-42",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Desk",
    "answer": "Bàn học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /desk/",
    "status": "new"
  },
  {
    "id": "oxford-43",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Crayon",
    "answer": "Bút chì màu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkreɪ.ɒn/",
    "status": "new"
  },
  {
    "id": "oxford-44",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Computer",
    "answer": "Máy tính bàn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəmˈpjuː.tər/",
    "status": "new"
  },
  {
    "id": "oxford-45",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Compass",
    "answer": "Com-pa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌm.pəs/",
    "status": "new"
  },
  {
    "id": "oxford-46",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Coloured Pencil",
    "answer": "Bút chì màu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkʌl.əd ˈpen.səl/",
    "status": "new"
  },
  {
    "id": "oxford-47",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Clock",
    "answer": "Đồng hồ treo tường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klɒk/",
    "status": "new"
  },
  {
    "id": "oxford-48",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Clamp",
    "answer": "Kẹp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: klæmp/",
    "status": "new"
  },
  {
    "id": "oxford-49",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Chalk",
    "answer": "Phấn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɔːk/",
    "status": "new"
  },
  {
    "id": "oxford-50",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Chair",
    "answer": "Ghế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃeər/",
    "status": "new"
  },
  {
    "id": "oxford-51",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Carbon paper",
    "answer": "Giấy than",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɑː.bən ˌpeɪ.pər/",
    "status": "new"
  },
  {
    "id": "oxford-52",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Calculator",
    "answer": "Máy tính cầm tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæl.kjə.leɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-53",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Bookcase",
    "answer": "Giá sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʊk.keɪs/",
    "status": "new"
  },
  {
    "id": "oxford-54",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Book",
    "answer": "Sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bʊk/",
    "status": "new"
  },
  {
    "id": "oxford-55",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Board",
    "answer": "Bảng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɔːd/",
    "status": "new"
  },
  {
    "id": "oxford-56",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Blackboard",
    "answer": "Bảng đen",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈblæk.bɔːd/",
    "status": "new"
  },
  {
    "id": "oxford-57",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Binder",
    "answer": "Bìa rời (báo, tạp chí)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbaɪn.dər/",
    "status": "new"
  },
  {
    "id": "oxford-58",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Beaker",
    "answer": "Cốc bêse",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbiː.kər/",
    "status": "new"
  },
  {
    "id": "oxford-59",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Ballpoint pen",
    "answer": "Bút bi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌbɔːl.pɔɪnt ˈpen/",
    "status": "new"
  },
  {
    "id": "oxford-60",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Bag",
    "answer": "Cặp sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bæɡ/",
    "status": "new"
  },
  {
    "id": "oxford-61",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Backpack",
    "answer": "Ba lô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbæk.pæk/",
    "status": "new"
  },
  {
    "id": "oxford-62",
    "category": "english",
    "subCategory": "Đồ dùng học tập",
    "question": "Funnel",
    "answer": "Cái phễu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfʌn.əl/",
    "status": "new"
  },
  {
    "id": "oxford-63",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Pack",
    "answer": "Bó, gói",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pæk/",
    "status": "new"
  },
  {
    "id": "oxford-64",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Paint",
    "answer": "Quét sơn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /peint/",
    "status": "new"
  },
  {
    "id": "oxford-65",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Paste",
    "answer": "Dán",
    "example": "Từ loại: Động từ (v) | Phiên âm: /peist/",
    "status": "new"
  },
  {
    "id": "oxford-66",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Pick",
    "answer": "Hái, nhổ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pik/",
    "status": "new"
  },
  {
    "id": "oxford-67",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Plant",
    "answer": "Trồng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /plænt/",
    "status": "new"
  },
  {
    "id": "oxford-68",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Play",
    "answer": "Chơi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /plei/",
    "status": "new"
  },
  {
    "id": "oxford-69",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Point",
    "answer": "Chỉ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pɔint/",
    "status": "new"
  },
  {
    "id": "oxford-70",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Pour",
    "answer": "Rót, đổ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pɔ:/",
    "status": "new"
  },
  {
    "id": "oxford-71",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Pull",
    "answer": "Lôi, kéo",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pul/",
    "status": "new"
  },
  {
    "id": "oxford-72",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Push",
    "answer": "Xô, đẩy",
    "example": "Từ loại: Động từ (v) | Phiên âm: /puʃ/",
    "status": "new"
  },
  {
    "id": "oxford-73",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Rake",
    "answer": "Cào, cời",
    "example": "Từ loại: Động từ (v) | Phiên âm: /reik/",
    "status": "new"
  },
  {
    "id": "oxford-74",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Read",
    "answer": "Đọc",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ri:d/",
    "status": "new"
  },
  {
    "id": "oxford-75",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Ride",
    "answer": "Đi, cưỡi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /raid/",
    "status": "new"
  },
  {
    "id": "oxford-76",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Row",
    "answer": "Chèo thuyền",
    "example": "Từ loại: Động từ (v) | Phiên âm: /rou/",
    "status": "new"
  },
  {
    "id": "oxford-77",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Run",
    "answer": "Chạy",
    "example": "Từ loại: Động từ (v) | Phiên âm: /rʌn/",
    "status": "new"
  },
  {
    "id": "oxford-78",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Sail",
    "answer": "Lái (thuyền buồm)",
    "example": "Từ loại: Động từ (v) | Phiên âm: /seil/",
    "status": "new"
  },
  {
    "id": "oxford-79",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Scrub",
    "answer": "Lau, chùi, cọ rửa",
    "example": "Từ loại: Động từ (v) | Phiên âm: /skrʌb/",
    "status": "new"
  },
  {
    "id": "oxford-80",
    "category": "english",
    "subCategory": "Hành động",
    "question": "See",
    "answer": "Thấy, xem",
    "example": "Từ loại: Động từ (v) | Phiên âm: /si:/",
    "status": "new"
  },
  {
    "id": "oxford-81",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Set",
    "answer": "Để, đặt",
    "example": "Từ loại: Động từ (v) | Phiên âm: /set/",
    "status": "new"
  },
  {
    "id": "oxford-82",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Sew",
    "answer": "May, khâu",
    "example": "Từ loại: Động từ (v) | Phiên âm: /soʊ/",
    "status": "new"
  },
  {
    "id": "oxford-83",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Shout",
    "answer": "La hét, reo hò",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ʃaʊt/",
    "status": "new"
  },
  {
    "id": "oxford-84",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Show",
    "answer": "Cho xem, cho thấy, trưng bày",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ʃou/",
    "status": "new"
  },
  {
    "id": "oxford-85",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Sing",
    "answer": "Hát, hót",
    "example": "Từ loại: Động từ (v) | Phiên âm: /siɳ/",
    "status": "new"
  },
  {
    "id": "oxford-86",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Sit",
    "answer": "Ngồi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sit/",
    "status": "new"
  },
  {
    "id": "oxford-87",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Skate",
    "answer": "Trượt băng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /skeit/",
    "status": "new"
  },
  {
    "id": "oxford-88",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Skip",
    "answer": "Nhảy",
    "example": "Từ loại: Động từ (v) | Phiên âm: /skip/",
    "status": "new"
  },
  {
    "id": "oxford-89",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Sleep",
    "answer": "Ngủ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sli:p/",
    "status": "new"
  },
  {
    "id": "oxford-90",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Slide",
    "answer": "Trượt",
    "example": "Từ loại: Động từ (v) | Phiên âm: /slaid/",
    "status": "new"
  },
  {
    "id": "oxford-91",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Sneeze",
    "answer": "Hắt hơi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sni:z/",
    "status": "new"
  },
  {
    "id": "oxford-92",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Spin",
    "answer": "Quay",
    "example": "Từ loại: Động từ (v) | Phiên âm: /spɪn/",
    "status": "new"
  },
  {
    "id": "oxford-93",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Stand",
    "answer": "Đứng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /stænd/",
    "status": "new"
  },
  {
    "id": "oxford-94",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Stop",
    "answer": "Ngừng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /stɔp/",
    "status": "new"
  },
  {
    "id": "oxford-95",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Sweep",
    "answer": "Quét qua; lan ra",
    "example": "Từ loại: Động từ (v) | Phiên âm: /swi:p/",
    "status": "new"
  },
  {
    "id": "oxford-96",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Swim",
    "answer": "Bơi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /swim/",
    "status": "new"
  },
  {
    "id": "oxford-97",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Swing",
    "answer": "Đu đưa",
    "example": "Từ loại: Động từ (v) | Phiên âm: /swɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-98",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Take",
    "answer": "Cầm, nắm, lấy",
    "example": "Từ loại: Động từ (v) | Phiên âm: /teik/",
    "status": "new"
  },
  {
    "id": "oxford-99",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Talk",
    "answer": "Nói chuyện",
    "example": "Từ loại: Động từ (v) | Phiên âm: /tɔ:k/",
    "status": "new"
  },
  {
    "id": "oxford-100",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Tell",
    "answer": "Nói",
    "example": "Từ loại: Động từ (v) | Phiên âm: /tel/",
    "status": "new"
  },
  {
    "id": "oxford-101",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Throw",
    "answer": "Ném, quăng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /θrəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-102",
    "category": "english",
    "subCategory": "Hành động",
    "question": "Tie",
    "answer": "Buộc, cột, trói",
    "example": "Từ loại: Động từ (v) | Phiên âm: /tai/",
    "status": "new"
  },
  {
    "id": "oxford-103",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Brush your teeth",
    "answer": "Đánh răng",
    "example": "Từ loại: Cụm động từ | Phiên âm: /brʌʃ ti:θ/",
    "status": "new"
  },
  {
    "id": "oxford-104",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Buy",
    "answer": "Mua",
    "example": "Từ loại: Động từ (v) | Phiên âm: /bai/",
    "status": "new"
  },
  {
    "id": "oxford-105",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Comb the hair",
    "answer": "Chải đầu",
    "example": "Từ loại: Cụm động từ | Phiên âm: /koum ðə heə/",
    "status": "new"
  },
  {
    "id": "oxford-106",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Cook",
    "answer": "Nấu ăn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /kuk/",
    "status": "new"
  },
  {
    "id": "oxford-107",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Do exercise",
    "answer": "Tập thể dục",
    "example": "Từ loại: Cụm động từ | Phiên âm: /du: eksəsaiz/",
    "status": "new"
  },
  {
    "id": "oxford-108",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Do your homework",
    "answer": "Làm bài tập về nhà",
    "example": "Từ loại: Cụm động từ | Phiên âm: /du ‘houmwə:k/",
    "status": "new"
  },
  {
    "id": "oxford-109",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Eat out",
    "answer": "Đi ăn ở ngoài",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˈiːt ˌaʊt/",
    "status": "new"
  },
  {
    "id": "oxford-110",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Feed the dog",
    "answer": "Cho chó ăn",
    "example": "Từ loại: Cụm động từ | Phiên âm: /fi:d ðə dɔg/",
    "status": "new"
  },
  {
    "id": "oxford-111",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Finish working",
    "answer": "Kết thúc công việc",
    "example": "Từ loại: Cụm động từ | Phiên âm: /’finiʃ ˈwəːkɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-112",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Gardening",
    "answer": "Làm vườn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈɡɑː.dən.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-113",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Get dressed",
    "answer": "Mặc quần áo",
    "example": "Từ loại: Cụm động từ | Phiên âm: /get dres/",
    "status": "new"
  },
  {
    "id": "oxford-114",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Get up",
    "answer": "Thức dậy",
    "example": "Từ loại: Cụm động từ | Phiên âm: /get Λp/",
    "status": "new"
  },
  {
    "id": "oxford-115",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Go home",
    "answer": "Về nhà",
    "example": "Từ loại: Cụm động từ | Phiên âm: /gou houm/",
    "status": "new"
  },
  {
    "id": "oxford-116",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Go shopping",
    "answer": "Đi mua sắm",
    "example": "Từ loại: Cụm động từ | Phiên âm: /gouˈʃɒp.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-117",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Go to bed",
    "answer": "Đi ngủ",
    "example": "Từ loại: Cụm động từ | Phiên âm: /gou tə bed/",
    "status": "new"
  },
  {
    "id": "oxford-118",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Go to the movies",
    "answer": "Đi xem phim",
    "example": "Từ loại: Cụm động từ | Phiên âm: /gou tə ðəˈmuː.vi/",
    "status": "new"
  },
  {
    "id": "oxford-119",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Have a bath",
    "answer": "Đi tắm",
    "example": "Từ loại: Cụm động từ | Phiên âm: /hæv ə ‘bɑ:θ/",
    "status": "new"
  },
  {
    "id": "oxford-120",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Have a nap",
    "answer": "Ngủ ngắn",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˌhæv.ə næp/",
    "status": "new"
  },
  {
    "id": "oxford-121",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Have breakfast",
    "answer": "Ăn sáng",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˌhævˈbrek.fəst/",
    "status": "new"
  },
  {
    "id": "oxford-122",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Have dinner",
    "answer": "Án tối",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˌhævˈdɪn.ər/",
    "status": "new"
  },
  {
    "id": "oxford-123",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Have lunch",
    "answer": "Ăn trưa",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˌhæv lʌntʃ/",
    "status": "new"
  },
  {
    "id": "oxford-124",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Have a shower",
    "answer": "Tắm vòi hoa sen",
    "example": "Từ loại: Cụm động từ | Phiên âm: /hæv ə ˈʃaʊər/",
    "status": "new"
  },
  {
    "id": "oxford-125",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Listen to music",
    "answer": "Nghe nhạc",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˈlɪs.ən tuːˈmjuː.zɪk/",
    "status": "new"
  },
  {
    "id": "oxford-126",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Make breakfast",
    "answer": "Làm bữa ăn sáng",
    "example": "Từ loại: Cụm động từ | Phiên âm: /meik ‘brekfəst/",
    "status": "new"
  },
  {
    "id": "oxford-127",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Make up",
    "answer": "Trang điểm",
    "example": "Từ loại: Cụm động từ | Phiên âm: /meik Λp/",
    "status": "new"
  },
  {
    "id": "oxford-128",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Meditation",
    "answer": "Thiền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /,medi’teiʃn/",
    "status": "new"
  },
  {
    "id": "oxford-129",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Play an instrument",
    "answer": "Chơi nhạc cụ",
    "example": "Từ loại: Cụm động từ | Phiên âm: /pleɪ ænˈɪn.strə.mənt/",
    "status": "new"
  },
  {
    "id": "oxford-130",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Play outside",
    "answer": "Đi ra ngoài chơi",
    "example": "Từ loại: Cụm động từ | Phiên âm: /pleɪ ˌaʊtˈsaɪd/",
    "status": "new"
  },
  {
    "id": "oxford-131",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Play sports",
    "answer": "Chơi thể thao",
    "example": "Từ loại: Cụm động từ | Phiên âm: /pleɪ spɔːts/",
    "status": "new"
  },
  {
    "id": "oxford-132",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Play video games",
    "answer": "Chơi trò chơi điện tử",
    "example": "Từ loại: Cụm động từ | Phiên âm: /pleɪ ˈvɪd.i.əʊ ˌɡeɪmz/",
    "status": "new"
  },
  {
    "id": "oxford-133",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Read books",
    "answer": "Đọc sách",
    "example": "Từ loại: Cụm động từ | Phiên âm: /riːd bʊks /",
    "status": "new"
  },
  {
    "id": "oxford-134",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Read newspapers",
    "answer": "Đọc báo",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ri:d’nju:z,peipəz/",
    "status": "new"
  },
  {
    "id": "oxford-135",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Relax",
    "answer": "Thư giãn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /rɪˈlæks/",
    "status": "new"
  },
  {
    "id": "oxford-136",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Set the alarm",
    "answer": "Đặt chuông báo thức",
    "example": "Từ loại: Cụm động từ | Phiên âm: /set ðə ə’lɑ:m/",
    "status": "new"
  },
  {
    "id": "oxford-137",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Shave",
    "answer": "Cạo râu",
    "example": "Từ loại: Động từ (v) | Phiên âm: /∫eiv/",
    "status": "new"
  },
  {
    "id": "oxford-138",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Sleep",
    "answer": "Ngủ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sliːp/",
    "status": "new"
  },
  {
    "id": "oxford-139",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Study",
    "answer": "Học tập, nghiên cứu",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈstʌd.i/",
    "status": "new"
  },
  {
    "id": "oxford-140",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Surf the internet",
    "answer": "Lướt mạng",
    "example": "Từ loại: Cụm động từ | Phiên âm: /sɜːf ðiː ˈɪn.tə.net/",
    "status": "new"
  },
  {
    "id": "oxford-141",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Take the rubbish out",
    "answer": "Đi đổ rác",
    "example": "Từ loại: Cụm động từ | Phiên âm: /teik ðə ‘rʌbiʃ aut/",
    "status": "new"
  },
  {
    "id": "oxford-142",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Drink",
    "answer": "Uống",
    "example": "Từ loại: Động từ (v) | Phiên âm: /driɳk/",
    "status": "new"
  },
  {
    "id": "oxford-143",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Turn off",
    "answer": "Tắt",
    "example": "Từ loại: phrasal v | Phiên âm: /tɜrn ɒf/",
    "status": "new"
  },
  {
    "id": "oxford-144",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Visit your friend",
    "answer": "Thăm bạn bè",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˈvɪz.ɪt jɔːr frend/",
    "status": "new"
  },
  {
    "id": "oxford-145",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Wake up",
    "answer": "Tỉnh giấc",
    "example": "Từ loại: phrasal v | Phiên âm: /weik Λp/",
    "status": "new"
  },
  {
    "id": "oxford-146",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Wash your face",
    "answer": "Rửa mặt",
    "example": "Từ loại: Cụm động từ | Phiên âm: /wɒʃ jɔːr feɪs/",
    "status": "new"
  },
  {
    "id": "oxford-147",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Wash the dishes",
    "answer": "Rửa chén",
    "example": "Từ loại: Cụm động từ | Phiên âm: /wɔʃ ðə dɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-148",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Watch television",
    "answer": "Xem tivi",
    "example": "Từ loại: Cụm động từ | Phiên âm: /wɔtʃ ‘teli,viʤn/",
    "status": "new"
  },
  {
    "id": "oxford-149",
    "category": "english",
    "subCategory": "Hoạt động thường ngày",
    "question": "Work",
    "answer": "Làm việc",
    "example": "Từ loại: Động từ (v) | Phiên âm: /wə:k/",
    "status": "new"
  },
  {
    "id": "oxford-150",
    "category": "english",
    "subCategory": "Biển",
    "question": "Sea",
    "answer": "Biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /siː/",
    "status": "new"
  },
  {
    "id": "oxford-151",
    "category": "english",
    "subCategory": "Biển",
    "question": "Ocean",
    "answer": "Đại dương",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈəʊʃən/",
    "status": "new"
  },
  {
    "id": "oxford-152",
    "category": "english",
    "subCategory": "Biển",
    "question": "Wave",
    "answer": "Sóng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /weɪv/",
    "status": "new"
  },
  {
    "id": "oxford-153",
    "category": "english",
    "subCategory": "Biển",
    "question": "Island",
    "answer": "Hòn đảo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈaɪlənd/",
    "status": "new"
  },
  {
    "id": "oxford-154",
    "category": "english",
    "subCategory": "Biển",
    "question": "Harbor",
    "answer": "Cảng biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɑːr.bɚ/",
    "status": "new"
  },
  {
    "id": "oxford-155",
    "category": "english",
    "subCategory": "Biển",
    "question": "Lighthouse",
    "answer": "Hải đăng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪthaʊs/",
    "status": "new"
  },
  {
    "id": "oxford-156",
    "category": "english",
    "subCategory": "Biển",
    "question": "Submarine",
    "answer": "Tàu ngầm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌsʌbmərˈiːn/",
    "status": "new"
  },
  {
    "id": "oxford-157",
    "category": "english",
    "subCategory": "Biển",
    "question": "Ship",
    "answer": "Tàu thuỷ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃɪp/",
    "status": "new"
  },
  {
    "id": "oxford-158",
    "category": "english",
    "subCategory": "Biển",
    "question": "Boat",
    "answer": "Thuyền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bəʊt/",
    "status": "new"
  },
  {
    "id": "oxford-159",
    "category": "english",
    "subCategory": "Biển",
    "question": "Captain",
    "answer": "Thuyền trưởng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæptɪn/",
    "status": "new"
  },
  {
    "id": "oxford-160",
    "category": "english",
    "subCategory": "Biển",
    "question": "Fisherman",
    "answer": "Ngư dân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɪʃəmən/",
    "status": "new"
  },
  {
    "id": "oxford-161",
    "category": "english",
    "subCategory": "Biển",
    "question": "Lifeguard",
    "answer": "Người cứu hộ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪfɡɑːd/",
    "status": "new"
  },
  {
    "id": "oxford-162",
    "category": "english",
    "subCategory": "Biển",
    "question": "Seashore",
    "answer": "Bờ biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsiːʃɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-163",
    "category": "english",
    "subCategory": "Biển",
    "question": "Beach",
    "answer": "Bãi biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /biːtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-164",
    "category": "english",
    "subCategory": "Biển",
    "question": "Coast",
    "answer": "Bờ (biển)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəʊst/",
    "status": "new"
  },
  {
    "id": "oxford-165",
    "category": "english",
    "subCategory": "Biển",
    "question": "Seagull",
    "answer": "Mòng biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsiː.ɡʌl/",
    "status": "new"
  },
  {
    "id": "oxford-166",
    "category": "english",
    "subCategory": "Biển",
    "question": "Whale",
    "answer": "Cá voi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /weɪl/",
    "status": "new"
  },
  {
    "id": "oxford-167",
    "category": "english",
    "subCategory": "Biển",
    "question": "Shark",
    "answer": "Cá mập",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃɑːk/",
    "status": "new"
  },
  {
    "id": "oxford-168",
    "category": "english",
    "subCategory": "Biển",
    "question": "Dolphin",
    "answer": "Cá heo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɒlfɪn/",
    "status": "new"
  },
  {
    "id": "oxford-169",
    "category": "english",
    "subCategory": "Biển",
    "question": "Octopus",
    "answer": "Bạch tuộc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɑːktəpəs/",
    "status": "new"
  },
  {
    "id": "oxford-170",
    "category": "english",
    "subCategory": "Biển",
    "question": "Fish",
    "answer": "Cá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-171",
    "category": "english",
    "subCategory": "Biển",
    "question": "Jellyfish",
    "answer": "Sứa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒelifɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-172",
    "category": "english",
    "subCategory": "Biển",
    "question": "Sea horse",
    "answer": "Cá ngựa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsiˌhɔrs/",
    "status": "new"
  },
  {
    "id": "oxford-173",
    "category": "english",
    "subCategory": "Biển",
    "question": "Seaweed",
    "answer": "Rong biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsiːwiːd/",
    "status": "new"
  },
  {
    "id": "oxford-174",
    "category": "english",
    "subCategory": "Biển",
    "question": "Coral",
    "answer": "San hô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒrəl/",
    "status": "new"
  },
  {
    "id": "oxford-175",
    "category": "english",
    "subCategory": "Biển",
    "question": "Coral reef",
    "answer": "Rạn san hô",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌkɒr.əl ˈriːf/",
    "status": "new"
  },
  {
    "id": "oxford-176",
    "category": "english",
    "subCategory": "Biển",
    "question": "Shellfish",
    "answer": "Động vật có vỏ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʃel.fɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-177",
    "category": "english",
    "subCategory": "Biển",
    "question": "Clam",
    "answer": "Nghêu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klæm/",
    "status": "new"
  },
  {
    "id": "oxford-178",
    "category": "english",
    "subCategory": "Biển",
    "question": "Starfish",
    "answer": "Sao biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstɑːrfɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-179",
    "category": "english",
    "subCategory": "Biển",
    "question": "Seal",
    "answer": "Hải cẩu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /siːl/",
    "status": "new"
  },
  {
    "id": "oxford-180",
    "category": "english",
    "subCategory": "Biển",
    "question": "Turtle",
    "answer": "Rùa biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɜːtl/",
    "status": "new"
  },
  {
    "id": "oxford-181",
    "category": "english",
    "subCategory": "Biển",
    "question": "Crab",
    "answer": "Cua",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kræb/",
    "status": "new"
  },
  {
    "id": "oxford-182",
    "category": "english",
    "subCategory": "Số",
    "question": "Cardinal number",
    "answer": "Số đếm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɑr·dən·əl ˈnʌm·bər/",
    "status": "new"
  },
  {
    "id": "oxford-183",
    "category": "english",
    "subCategory": "Số",
    "question": "Ordinal number",
    "answer": "Số thứ tự",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɔr·dən·əl ˈnʌm·bər/",
    "status": "new"
  },
  {
    "id": "oxford-184",
    "category": "english",
    "subCategory": "Số",
    "question": "Decimal",
    "answer": "Số thập phân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdes.ɪ.məl/",
    "status": "new"
  },
  {
    "id": "oxford-185",
    "category": "english",
    "subCategory": "Số",
    "question": "Fraction",
    "answer": "Phân số",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfræk.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-186",
    "category": "english",
    "subCategory": "Số",
    "question": "Percentage",
    "answer": "Phần trăm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pəˈsen.tɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-187",
    "category": "english",
    "subCategory": "Số",
    "question": "Arithmetic",
    "answer": "Số học",
    "example": "Từ loại: adj/ n | Phiên âm: /əˈrɪθ.mə.tɪk/",
    "status": "new"
  },
  {
    "id": "oxford-188",
    "category": "english",
    "subCategory": "Số",
    "question": "Divide",
    "answer": "Chia",
    "example": "Từ loại: Động từ (v) | Phiên âm: /dɪˈvaɪd/",
    "status": "new"
  },
  {
    "id": "oxford-189",
    "category": "english",
    "subCategory": "Số",
    "question": "Plus",
    "answer": "Cộng",
    "example": "Từ loại: pre | Phiên âm: /plʌs/",
    "status": "new"
  },
  {
    "id": "oxford-190",
    "category": "english",
    "subCategory": "Số",
    "question": "Minus",
    "answer": "Trừ",
    "example": "Từ loại: pre | Phiên âm: /ˈmaɪ.nəs/",
    "status": "new"
  },
  {
    "id": "oxford-191",
    "category": "english",
    "subCategory": "Số",
    "question": "Multiply",
    "answer": "Nhân",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈmʌl.tɪ.plaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-192",
    "category": "english",
    "subCategory": "Số",
    "question": "Equal",
    "answer": "Ngang bằng, bằng",
    "example": "Từ loại: adj/ v | Phiên âm: /ˈiː.kwəl/",
    "status": "new"
  },
  {
    "id": "oxford-193",
    "category": "english",
    "subCategory": "Số",
    "question": "Total",
    "answer": "Tổng, tổng số",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈtəʊ.təl/",
    "status": "new"
  },
  {
    "id": "oxford-194",
    "category": "english",
    "subCategory": "Số",
    "question": "Dozen",
    "answer": "Tá (12 đơn vị)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʌz.ən/",
    "status": "new"
  },
  {
    "id": "oxford-195",
    "category": "english",
    "subCategory": "Số",
    "question": "Around",
    "answer": "Khoảng",
    "example": "Từ loại: Trạng từ (adv) | Phiên âm: /əˈraʊnd/",
    "status": "new"
  },
  {
    "id": "oxford-196",
    "category": "english",
    "subCategory": "Số",
    "question": "Zero",
    "answer": "Số không",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈzɪə.rəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-197",
    "category": "english",
    "subCategory": "Số",
    "question": "Hundred",
    "answer": "Một trăm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhʌn.drəd/",
    "status": "new"
  },
  {
    "id": "oxford-198",
    "category": "english",
    "subCategory": "Số",
    "question": "Thousand",
    "answer": "Một nghìn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈθaʊ.zənd/",
    "status": "new"
  },
  {
    "id": "oxford-199",
    "category": "english",
    "subCategory": "Số",
    "question": "Million",
    "answer": "Một triệu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɪl.jən/",
    "status": "new"
  },
  {
    "id": "oxford-200",
    "category": "english",
    "subCategory": "Số",
    "question": "Billion",
    "answer": "Một tỷ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɪl.jən/",
    "status": "new"
  },
  {
    "id": "oxford-201",
    "category": "english",
    "subCategory": "Số",
    "question": "Half",
    "answer": "Một nửa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɑːf/",
    "status": "new"
  },
  {
    "id": "oxford-202",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Customer",
    "answer": "Khách hàng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌs.tə.mər/",
    "status": "new"
  },
  {
    "id": "oxford-203",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Cashier",
    "answer": "Nhân viên thu ngân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kæʃˈɪər/",
    "status": "new"
  },
  {
    "id": "oxford-204",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Attendant",
    "answer": "Người phục vụ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈten.dənt/",
    "status": "new"
  },
  {
    "id": "oxford-205",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Manager",
    "answer": "Giám đốc, quản lý",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmæn.ɪ.dʒər/",
    "status": "new"
  },
  {
    "id": "oxford-206",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Wallet",
    "answer": "Ví tiền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɒl.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-207",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Purse",
    "answer": "Ví tiền (nữ)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɜːs/",
    "status": "new"
  },
  {
    "id": "oxford-208",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Scale",
    "answer": "Cái cân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skeɪl/",
    "status": "new"
  },
  {
    "id": "oxford-209",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Counter",
    "answer": "Quầy hàng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkaʊn.tər/",
    "status": "new"
  },
  {
    "id": "oxford-210",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Barcode reader",
    "answer": "Máy đọc mã vạch",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbɑːˌkəʊdˈriː.dər/",
    "status": "new"
  },
  {
    "id": "oxford-211",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Receipt",
    "answer": "Biên lai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪˈsiːt/",
    "status": "new"
  },
  {
    "id": "oxford-212",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Pay",
    "answer": "Trả tiền",
    "example": "Từ loại: Động từ (v) | Phiên âm: /peɪ/",
    "status": "new"
  },
  {
    "id": "oxford-213",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Expensive",
    "answer": "Đắt",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ɪkˈspen.sɪv/",
    "status": "new"
  },
  {
    "id": "oxford-214",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Cheap",
    "answer": "Rẻ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃiːp/",
    "status": "new"
  },
  {
    "id": "oxford-215",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Discount",
    "answer": "Giảm giá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɪs.kaʊnt/",
    "status": "new"
  },
  {
    "id": "oxford-216",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Sell",
    "answer": "Bán",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sel/",
    "status": "new"
  },
  {
    "id": "oxford-217",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Price",
    "answer": "Giá cả",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /praɪs/",
    "status": "new"
  },
  {
    "id": "oxford-218",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Trolley",
    "answer": "Xe đẩy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtrɒl.i/",
    "status": "new"
  },
  {
    "id": "oxford-219",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Credit card",
    "answer": "Thẻ tín dụng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkred.ɪt ˌkɑːd/",
    "status": "new"
  },
  {
    "id": "oxford-220",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Cash",
    "answer": "Tiền mặt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kæʃ/",
    "status": "new"
  },
  {
    "id": "oxford-221",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Shop",
    "answer": "Cửa hàng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-222",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Money",
    "answer": "Tiền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmʌn.i/",
    "status": "new"
  },
  {
    "id": "oxford-223",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Basket",
    "answer": "Rổ, giỏ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɑː.skɪt/",
    "status": "new"
  },
  {
    "id": "oxford-224",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Bag",
    "answer": "Túi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bæɡ/",
    "status": "new"
  },
  {
    "id": "oxford-225",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Buy",
    "answer": "Mua",
    "example": "Từ loại: Động từ (v) | Phiên âm: /baɪ/",
    "status": "new"
  },
  {
    "id": "oxford-226",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Greengrocer",
    "answer": "Cửa hàng bán rau quả",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡriːŋ.ɡrəʊ.sər/",
    "status": "new"
  },
  {
    "id": "oxford-227",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Housewares",
    "answer": "Đồ gia dụng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhaʊs.weəz/",
    "status": "new"
  },
  {
    "id": "oxford-228",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Toy store",
    "answer": "Cửa hàng đồ chơi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /tɔɪ stɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-229",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Shopping mall",
    "answer": "Trung tâm mua sắm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈʃɒp.ɪŋ ˌmɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-230",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Grocery store",
    "answer": "Cửa hàng tạp hóa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɡrəʊ.sər.i ˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-231",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Convenience store",
    "answer": "Cửa hàng tiện lợi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /kənˈviː.ni.əns ˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-232",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Bargain",
    "answer": "Mặc cả",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɑː.ɡɪn/",
    "status": "new"
  },
  {
    "id": "oxford-233",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Refund",
    "answer": "Hoàn lại, trả lại",
    "example": "Từ loại: n/ v | Phiên âm: /ˈriː.fʌnd/",
    "status": "new"
  },
  {
    "id": "oxford-234",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Brochure",
    "answer": "Tập quảng cáo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbrəʊ.ʃər/",
    "status": "new"
  },
  {
    "id": "oxford-235",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Liquor store",
    "answer": "Quán rượu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈlɪk.ə ˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-236",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Drugstore",
    "answer": "Tiệm thuốc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdrʌɡ.stɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-237",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Candy store",
    "answer": "Cửa hàng kẹo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkæn.di ˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-238",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Gift shop",
    "answer": "Cửa hàng đồ lưu niệm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɡɪft ˌʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-239",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Pet shop",
    "answer": "Tiệm thú cưng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /pet ʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-240",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Shoe shop",
    "answer": "Tiệm giày",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ʃuːʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-241",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Meat shop",
    "answer": "Cửa hàng thịt",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /miːt ʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-242",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Florist",
    "answer": "Người bán hoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈflɒr.ɪst/",
    "status": "new"
  },
  {
    "id": "oxford-243",
    "category": "english",
    "subCategory": "Mua sắm",
    "question": "Butcher",
    "answer": "Người bán thịt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʊtʃ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-244",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Lamp",
    "answer": "Đèn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /læmp/",
    "status": "new"
  },
  {
    "id": "oxford-245",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Pillowcase",
    "answer": "Bao gối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɪl.əʊ.keɪs/",
    "status": "new"
  },
  {
    "id": "oxford-246",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Curtain",
    "answer": "Rèm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɜː.tən/",
    "status": "new"
  },
  {
    "id": "oxford-247",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Bed",
    "answer": "Giường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bed/",
    "status": "new"
  },
  {
    "id": "oxford-248",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Mirror",
    "answer": "Gương",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɪr.ər/",
    "status": "new"
  },
  {
    "id": "oxford-249",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Cushion",
    "answer": "Đệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʊʃ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-250",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Wardrobe",
    "answer": "Tủ quần áo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔː.drəʊb/",
    "status": "new"
  },
  {
    "id": "oxford-251",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Fitted carpet",
    "answer": "Thảm lót sàn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌfɪt.ɪd ˈkɑː.pɪt/",
    "status": "new"
  },
  {
    "id": "oxford-252",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Dressing table",
    "answer": "Bàn trang điểm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈdres.ɪŋ ˌteɪ.bəl/",
    "status": "new"
  },
  {
    "id": "oxford-253",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Wallpaper",
    "answer": "Giấy dán tường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔːlˌpeɪ.pər/",
    "status": "new"
  },
  {
    "id": "oxford-254",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Pillow",
    "answer": "Gối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɪl.əʊ/",
    "status": "new"
  },
  {
    "id": "oxford-255",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Carpet",
    "answer": "Tấm thảm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈKɑː.pɪt /",
    "status": "new"
  },
  {
    "id": "oxford-256",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Blind",
    "answer": "Mành, rèm che",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /blaɪnd/",
    "status": "new"
  },
  {
    "id": "oxford-257",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Mattress",
    "answer": "Nệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmæt.rəs/",
    "status": "new"
  },
  {
    "id": "oxford-258",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Bedspread",
    "answer": "Khăn trải giường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbed.spred/",
    "status": "new"
  },
  {
    "id": "oxford-259",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Blanket",
    "answer": "Tấm chăn, mền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈblæŋ.kɪt/",
    "status": "new"
  },
  {
    "id": "oxford-260",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Jewelry",
    "answer": "Trang sức",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒuːl.ri/",
    "status": "new"
  },
  {
    "id": "oxford-261",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Alarm clock",
    "answer": "Đồng hồ báo thức",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /əˈlɑːm ˌklɒk/",
    "status": "new"
  },
  {
    "id": "oxford-262",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Air conditioner",
    "answer": "Máy điều hòa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈeə kənˌdɪʃ.ən.ər/",
    "status": "new"
  },
  {
    "id": "oxford-263",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Box spring",
    "answer": "Khung lò xo nâng nệm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbɒks ˌsprɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-264",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Comforter",
    "answer": "Chăn bông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌm.fə.tər/",
    "status": "new"
  },
  {
    "id": "oxford-265",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Hanger",
    "answer": "Móc treo (quần áo)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhæŋ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-266",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Closet",
    "answer": "Tủ đóng trong tường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈklɒz.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-267",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Comb",
    "answer": "Lược",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəʊm/",
    "status": "new"
  },
  {
    "id": "oxford-268",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Light switch",
    "answer": "Công tắc điện",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /laɪt swɪtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-269",
    "category": "english",
    "subCategory": "Phòng ngủ",
    "question": "Chest of drawers",
    "answer": "Tủ kéo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌtʃest əv ˈdrɔːz/",
    "status": "new"
  },
  {
    "id": "oxford-270",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Classmate",
    "answer": "Bạn cùng lớp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈklɑːs.meɪt/",
    "status": "new"
  },
  {
    "id": "oxford-271",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Schoolmate",
    "answer": "Bạn cùng trường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈskuːl.meɪt/",
    "status": "new"
  },
  {
    "id": "oxford-272",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Roommate",
    "answer": "Bạn cùng phòng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈruːm.meɪt/",
    "status": "new"
  },
  {
    "id": "oxford-273",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Soulmate",
    "answer": "Tri kỷ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsəʊl.meɪt/",
    "status": "new"
  },
  {
    "id": "oxford-274",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Colleague",
    "answer": "Đồng nghiệp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒl.iːɡ/",
    "status": "new"
  },
  {
    "id": "oxford-275",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Comradeship",
    "answer": "Tình bạn, tình đồng chí",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒm.reɪd.ʃɪp/",
    "status": "new"
  },
  {
    "id": "oxford-276",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Partner",
    "answer": "Cộng sự",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɑːt.nər/",
    "status": "new"
  },
  {
    "id": "oxford-277",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Associate",
    "answer": "Bạn đồng liêu, đồng minh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈsəʊ.si.eɪt/",
    "status": "new"
  },
  {
    "id": "oxford-278",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Buddy",
    "answer": "Bạn thân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʌd.i/",
    "status": "new"
  },
  {
    "id": "oxford-279",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Ally",
    "answer": "Đồng minh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæl.aɪ/",
    "status": "new"
  },
  {
    "id": "oxford-280",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Companion",
    "answer": "Bạn đồng hành",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəmˈpæn.jən/",
    "status": "new"
  },
  {
    "id": "oxford-281",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Pal",
    "answer": "Bạn (từ lóng)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pæl/",
    "status": "new"
  },
  {
    "id": "oxford-282",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Friendship",
    "answer": "Tình bạn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfrend.ʃɪp/",
    "status": "new"
  },
  {
    "id": "oxford-283",
    "category": "english",
    "subCategory": "Tình bạn",
    "question": "Close",
    "answer": "Thân thiết",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /kləʊz/",
    "status": "new"
  },
  {
    "id": "oxford-284",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Dishwasher",
    "answer": "Máy rửa chén",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɪʃˌwɒʃ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-285",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Dish drainer",
    "answer": "Kệ để chén bát",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /dɪʃ ˈdreɪ.nər/",
    "status": "new"
  },
  {
    "id": "oxford-286",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Steamer",
    "answer": "Nồi hấp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstiː.mər/",
    "status": "new"
  },
  {
    "id": "oxford-287",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Colander",
    "answer": "Cái chao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒl.ən.dər/",
    "status": "new"
  },
  {
    "id": "oxford-288",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Lid",
    "answer": "Nắp, vung",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /lɪd/",
    "status": "new"
  },
  {
    "id": "oxford-289",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Blender",
    "answer": "Máy xay sinh tố",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈblen.dər/",
    "status": "new"
  },
  {
    "id": "oxford-290",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Pot",
    "answer": "Nồi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɒt/",
    "status": "new"
  },
  {
    "id": "oxford-291",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Toaster",
    "answer": "Lò nướng bánh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtəʊ.stər/",
    "status": "new"
  },
  {
    "id": "oxford-292",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Dishtowel",
    "answer": "Khăn lau chén",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɪʃ.taʊəl/",
    "status": "new"
  },
  {
    "id": "oxford-293",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Refrigerator",
    "answer": "Tủ lạnh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪˈfrɪdʒ.ər.eɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-294",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Freezer",
    "answer": "Tủ đông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfriː.zər/",
    "status": "new"
  },
  {
    "id": "oxford-295",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Cabinet",
    "answer": "Tủ (có nhiều ngăn)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæb.ɪ.nət/",
    "status": "new"
  },
  {
    "id": "oxford-296",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Microwave",
    "answer": "Lò vi sóng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmaɪ.krə.weɪv/",
    "status": "new"
  },
  {
    "id": "oxford-297",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Bowl",
    "answer": "Bát, chén",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bəʊl/",
    "status": "new"
  },
  {
    "id": "oxford-298",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Cutting board",
    "answer": "Thớt",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkʌt.ɪŋ ˌbɔːd/",
    "status": "new"
  },
  {
    "id": "oxford-299",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Stove",
    "answer": "Bếp lò",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /stəʊv/",
    "status": "new"
  },
  {
    "id": "oxford-300",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Coffee maker",
    "answer": "Máy pha cà phê",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɒf.i ˌmeɪ.kər/",
    "status": "new"
  },
  {
    "id": "oxford-301",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Oven",
    "answer": "Lò, lò nướng",
    "example": "Từ loại: Trạng từ (adv) | Phiên âm: /ˈʌv.ən/",
    "status": "new"
  },
  {
    "id": "oxford-302",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Oven cleaner",
    "answer": "Nước tẩy rửa lò",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈʌv.ən ˈkliː.nər/",
    "status": "new"
  },
  {
    "id": "oxford-303",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Jar",
    "answer": "Lọ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʒɑːr/",
    "status": "new"
  },
  {
    "id": "oxford-304",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Sink",
    "answer": "Bồn rửa bát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sɪŋk/",
    "status": "new"
  },
  {
    "id": "oxford-305",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Dish rack",
    "answer": "Khay để ráo chén đĩa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈdɪʃ ˌræk/",
    "status": "new"
  },
  {
    "id": "oxford-306",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Sponge",
    "answer": "Bọt biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /spʌndʒ/",
    "status": "new"
  },
  {
    "id": "oxford-307",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Chopstick",
    "answer": "Đũa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɒp.stɪk/",
    "status": "new"
  },
  {
    "id": "oxford-308",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Pan",
    "answer": "Chảo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pæn/",
    "status": "new"
  },
  {
    "id": "oxford-309",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Cooker",
    "answer": "Bếp, nồi nấu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʊk.ər/",
    "status": "new"
  },
  {
    "id": "oxford-310",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Mug",
    "answer": "Cốc lớn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mʌɡ/",
    "status": "new"
  },
  {
    "id": "oxford-311",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Kettle",
    "answer": "Ấm đun nước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈket.əl/",
    "status": "new"
  },
  {
    "id": "oxford-312",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Glass",
    "answer": "Ly",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡlɑːs/",
    "status": "new"
  },
  {
    "id": "oxford-313",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Teapot",
    "answer": "Ấm pha trà",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtiː.pɒt/",
    "status": "new"
  },
  {
    "id": "oxford-314",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Grill",
    "answer": "Vỉ nướng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡrɪl/",
    "status": "new"
  },
  {
    "id": "oxford-315",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Tray",
    "answer": "Cái khay, cái mâm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /treɪ/",
    "status": "new"
  },
  {
    "id": "oxford-316",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Whisk",
    "answer": "Máy đánh trứng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /wɪsk/",
    "status": "new"
  },
  {
    "id": "oxford-317",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Knife",
    "answer": "Dao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /naɪf/",
    "status": "new"
  },
  {
    "id": "oxford-318",
    "category": "english",
    "subCategory": "Nhà bếp",
    "question": "Spoon",
    "answer": "Muỗng, thìa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /spuːn/",
    "status": "new"
  },
  {
    "id": "oxford-319",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Earring",
    "answer": "Bông tai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɪə.rɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-320",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Necklace",
    "answer": "Dây chuyền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnek.ləs/",
    "status": "new"
  },
  {
    "id": "oxford-321",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Bracelet",
    "answer": "Vòng tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbreɪ.slət/",
    "status": "new"
  },
  {
    "id": "oxford-322",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Brooch",
    "answer": "Trâm cài",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /brəʊtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-323",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Hair clip",
    "answer": "Kẹp tóc",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈHeə ˌklɪp /",
    "status": "new"
  },
  {
    "id": "oxford-324",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Wedding ring",
    "answer": "Nhẫn cưới",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈwed.ɪŋ ˌrɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-325",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Jeweler",
    "answer": "Thợ kim hoàn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒuː.ə.lɚ/",
    "status": "new"
  },
  {
    "id": "oxford-326",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Jewelry store",
    "answer": "Cửa hàng trang sức",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈdʒuː.əl.ri stɔː r /",
    "status": "new"
  },
  {
    "id": "oxford-327",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Anklet",
    "answer": "Vòng chân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæŋ.klət/",
    "status": "new"
  },
  {
    "id": "oxford-328",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Noble",
    "answer": "Quý",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈnəʊ.bəl/",
    "status": "new"
  },
  {
    "id": "oxford-329",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Luxurious",
    "answer": "Sang trọng, xa hoa",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /lʌɡˈʒʊə.ri.əs/",
    "status": "new"
  },
  {
    "id": "oxford-330",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Modern",
    "answer": "Hiện đại",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈmɒd.ən/",
    "status": "new"
  },
  {
    "id": "oxford-331",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Suitable",
    "answer": "Phù hợp, thích hợp",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsuː.tə.bəl/",
    "status": "new"
  },
  {
    "id": "oxford-332",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Twinkle",
    "answer": "Lấp lánh",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈtwɪŋ.kəl/",
    "status": "new"
  },
  {
    "id": "oxford-333",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Bead",
    "answer": "Hạt (của chuỗi hạt)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /biːd/",
    "status": "new"
  },
  {
    "id": "oxford-334",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Hair tie",
    "answer": "Dây buộc tóc",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈheə ˌtaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-335",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Pocket watch",
    "answer": "Đồng hồ bỏ túi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpɒk.ɪt wɒtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-336",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Tiepin",
    "answer": "Ghim cà vạt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtaɪ.pɪn/",
    "status": "new"
  },
  {
    "id": "oxford-337",
    "category": "english",
    "subCategory": "Đồ trang sức",
    "question": "Precious stone",
    "answer": "Đá quý",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌpreʃ.əs ˈstəʊn/",
    "status": "new"
  },
  {
    "id": "oxford-338",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Land",
    "answer": "Đất, đất đai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /lænd/",
    "status": "new"
  },
  {
    "id": "oxford-339",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Pollute",
    "answer": "Làm ô nhiễm",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pəˈluːt/",
    "status": "new"
  },
  {
    "id": "oxford-340",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Decompose",
    "answer": "Phân hủy",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˌdiː.kəmˈpəʊz/",
    "status": "new"
  },
  {
    "id": "oxford-341",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Balance",
    "answer": "Sự cân bằng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbæl.əns/",
    "status": "new"
  },
  {
    "id": "oxford-342",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Climate change",
    "answer": "Biến đổi khí hậu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈklaɪ.mət ˌtʃeɪndʒ/",
    "status": "new"
  },
  {
    "id": "oxford-343",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Global warming",
    "answer": "Nóng lên toàn cầu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌɡləʊ.bəl ˈwɔː.mɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-344",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Oil slick",
    "answer": "Dầu loang",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɔɪl ˌslɪk/",
    "status": "new"
  },
  {
    "id": "oxford-345",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Ozone layer",
    "answer": "Tầng ozon",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈəʊ.zəʊn ˌleɪ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-346",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Biodiversity",
    "answer": "Đa dạng sinh học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
    "status": "new"
  },
  {
    "id": "oxford-347",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Ecology",
    "answer": "Sinh thái học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /iˈkɒl.ə.dʒi/",
    "status": "new"
  },
  {
    "id": "oxford-348",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Water",
    "answer": "Nước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔː.tər/",
    "status": "new"
  },
  {
    "id": "oxford-349",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Air",
    "answer": "Không khí",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /eər/",
    "status": "new"
  },
  {
    "id": "oxford-350",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Forest",
    "answer": "Rừng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɒr.ɪst/",
    "status": "new"
  },
  {
    "id": "oxford-351",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Flora",
    "answer": "Hệ thực vật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈflɔː.rə/",
    "status": "new"
  },
  {
    "id": "oxford-352",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Creature",
    "answer": "Sinh vật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkriː.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-353",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Insect",
    "answer": "Côn trùng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɪn.sekt/",
    "status": "new"
  },
  {
    "id": "oxford-354",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Reproduction",
    "answer": "Sự sinh sản",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌriː.prəˈdʌk.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-355",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Wildlife",
    "answer": "Động vật hoang dã",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwaɪld.laɪf/",
    "status": "new"
  },
  {
    "id": "oxford-356",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Sewage",
    "answer": "Nước thải",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsuː.ɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-357",
    "category": "english",
    "subCategory": "Môi trường",
    "question": "Fauna",
    "answer": "Hệ động vật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɔː.nə/",
    "status": "new"
  },
  {
    "id": "oxford-358",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Drapes",
    "answer": "Màn cửa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dreɪps/",
    "status": "new"
  },
  {
    "id": "oxford-359",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Cushion",
    "answer": "Đệm ngồi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʊʃ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-360",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Sofa",
    "answer": "Ghế sô-pha",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsəʊ.fə/",
    "status": "new"
  },
  {
    "id": "oxford-361",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Rug",
    "answer": "Tấm thảm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / rʌɡ /",
    "status": "new"
  },
  {
    "id": "oxford-362",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Banister",
    "answer": "Lan can",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbæn.ɪ.stər/",
    "status": "new"
  },
  {
    "id": "oxford-363",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Bookcase",
    "answer": "Tủ sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʊk.keɪs/",
    "status": "new"
  },
  {
    "id": "oxford-364",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Ceiling",
    "answer": "Trần nhà",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsiː.lɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-365",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Clock",
    "answer": "Đồng hồ treo tường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klɒk/",
    "status": "new"
  },
  {
    "id": "oxford-366",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Desk",
    "answer": "Bàn làm việc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /desk/",
    "status": "new"
  },
  {
    "id": "oxford-367",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Frame",
    "answer": "Khung (ảnh, cửa)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /freɪm/",
    "status": "new"
  },
  {
    "id": "oxford-368",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Lampshade",
    "answer": "Chụp đèn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlæmp.ʃeɪd/",
    "status": "new"
  },
  {
    "id": "oxford-369",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Mantelpiece",
    "answer": "Bệ lò sưởi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmæn.təl.piːs/",
    "status": "new"
  },
  {
    "id": "oxford-370",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Painting",
    "answer": "Bức tranh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpeɪn.tɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-371",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Remote control",
    "answer": "Điều khiển từ xa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: rɪˌməʊt kənˈtrəʊl/",
    "status": "new"
  },
  {
    "id": "oxford-372",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Speaker",
    "answer": "Loa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈspiː.kər/",
    "status": "new"
  },
  {
    "id": "oxford-373",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Step",
    "answer": "Bậc thang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /step/",
    "status": "new"
  },
  {
    "id": "oxford-374",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Stereo system",
    "answer": "Dàn máy hát (có loa)",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈster.i.əʊ ˈsɪs.təm/",
    "status": "new"
  },
  {
    "id": "oxford-375",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Stereo",
    "answer": "Máy xtê-rê-ô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈster.i.əʊ/",
    "status": "new"
  },
  {
    "id": "oxford-376",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Television",
    "answer": "Ti vi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtel.ɪ.vɪʒ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-377",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Vase",
    "answer": "Cái bình, lọ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /vɑːz/",
    "status": "new"
  },
  {
    "id": "oxford-378",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Wall unit",
    "answer": "Tủ tường",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /wɔːl ˈjuː.nɪt/",
    "status": "new"
  },
  {
    "id": "oxford-379",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Lamp",
    "answer": "Đèn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /læmp/",
    "status": "new"
  },
  {
    "id": "oxford-380",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Calendar",
    "answer": "Lịch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæl.ən.dər/",
    "status": "new"
  },
  {
    "id": "oxford-381",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Fan",
    "answer": "Cái quạt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fæn/",
    "status": "new"
  },
  {
    "id": "oxford-382",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Chair",
    "answer": "Cái ghế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃeər/",
    "status": "new"
  },
  {
    "id": "oxford-383",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Stool",
    "answer": "Ghế đẩu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /stuːl/",
    "status": "new"
  },
  {
    "id": "oxford-384",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Ashtray",
    "answer": "Đồ gạt tàn thuốc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæʃ.treɪ/",
    "status": "new"
  },
  {
    "id": "oxford-385",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Bookshelf",
    "answer": "Kệ sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʊk.ʃelf/",
    "status": "new"
  },
  {
    "id": "oxford-386",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Fuse",
    "answer": "Cầu chì",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fjuːz/",
    "status": "new"
  },
  {
    "id": "oxford-387",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Switch",
    "answer": "Công tắc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /swɪtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-388",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Couch",
    "answer": "Trường kỷ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kaʊtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-389",
    "category": "english",
    "subCategory": "Phòng khách",
    "question": "Curtain",
    "answer": "Rèm cửa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɜː.tən/",
    "status": "new"
  },
  {
    "id": "oxford-390",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Radiologist",
    "answer": "Bác sĩ chụp X-quang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌreɪ.diˈɒl.ə.dʒɪst/",
    "status": "new"
  },
  {
    "id": "oxford-391",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Emergency room",
    "answer": "Phòng cấp cứu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ɪˈmɜː.dʒən.si ˌruːm/",
    "status": "new"
  },
  {
    "id": "oxford-392",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Obstetrician",
    "answer": "Bác sĩ sản khoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌɒb.stəˈtrɪʃ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-393",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Operating room",
    "answer": "Phòng phẫu thuật",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɒp.ər.eɪ.tɪŋ ˌruːm/",
    "status": "new"
  },
  {
    "id": "oxford-394",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Needle",
    "answer": "Kim tiêm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈniː.dəl/",
    "status": "new"
  },
  {
    "id": "oxford-395",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Laboratory",
    "answer": "Phòng thí nghiệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ləˈbɒr.ə.tər.i/",
    "status": "new"
  },
  {
    "id": "oxford-396",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Pharmacy",
    "answer": "Tiệm thuốc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɑː.mə.si/",
    "status": "new"
  },
  {
    "id": "oxford-397",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Hospital bed",
    "answer": "Giường bệnh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈhɒs.pɪ.təl bed/",
    "status": "new"
  },
  {
    "id": "oxford-398",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Call button",
    "answer": "Chuông gọi (y tá)",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /kɔːl ˈbʌt.ən/",
    "status": "new"
  },
  {
    "id": "oxford-399",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Doctor",
    "answer": "Bác sĩ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɒk.tər/",
    "status": "new"
  },
  {
    "id": "oxford-400",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Nurse",
    "answer": "Y tá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /nɜːs/",
    "status": "new"
  },
  {
    "id": "oxford-401",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Gurney",
    "answer": "Xe đẩy tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡɜː.ni/",
    "status": "new"
  },
  {
    "id": "oxford-402",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Waiting room",
    "answer": "Phòng chờ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈweɪ.tɪŋ ˌruːm/",
    "status": "new"
  },
  {
    "id": "oxford-403",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Surgeon",
    "answer": "Bác sĩ phẫu thuật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɜː.dʒən/",
    "status": "new"
  },
  {
    "id": "oxford-404",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Midwife",
    "answer": "Bà đỡ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɪd.waɪf/",
    "status": "new"
  },
  {
    "id": "oxford-405",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Injection",
    "answer": "Việc tiêm thuốc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪnˈdʒek.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-406",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Calcium",
    "answer": "Canxi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæl.si.əm/",
    "status": "new"
  },
  {
    "id": "oxford-407",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Hospital",
    "answer": "Bệnh viện",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɒs.pɪ.təl/",
    "status": "new"
  },
  {
    "id": "oxford-408",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Crutch",
    "answer": "Cái nạng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /krʌtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-409",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Wheelchair",
    "answer": "Xe lăn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: ˈwiːl.tʃeər/",
    "status": "new"
  },
  {
    "id": "oxford-410",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Paramedic",
    "answer": "Nhân viên y tế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌpær.əˈmed.ɪk/",
    "status": "new"
  },
  {
    "id": "oxford-411",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Stretcher",
    "answer": "Cáng cứu thương",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstretʃ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-412",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Rush",
    "answer": "Đưa đi, chuyển đi (nhanh)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rʌʃ/",
    "status": "new"
  },
  {
    "id": "oxford-413",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Treat",
    "answer": "Điều trị, chữa trị",
    "example": "Từ loại: Động từ (v) | Phiên âm: /triːt/",
    "status": "new"
  },
  {
    "id": "oxford-414",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Condition",
    "answer": "Tình trạng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kənˈdɪʃ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-415",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Recovery",
    "answer": "Sự bình phục",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪˈkʌv.ər.i/",
    "status": "new"
  },
  {
    "id": "oxford-416",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Suffer",
    "answer": "Chịu đựng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈsʌf.ər/",
    "status": "new"
  },
  {
    "id": "oxford-417",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Deteriorate",
    "answer": "Xấu đi, tệ hơn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /dɪˈtɪə.ri.ə.reɪt/",
    "status": "new"
  },
  {
    "id": "oxford-418",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Coma",
    "answer": "Sự hôn mê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkəʊ.mə/",
    "status": "new"
  },
  {
    "id": "oxford-419",
    "category": "english",
    "subCategory": "Bệnh viện",
    "question": "Common cold",
    "answer": "Bệnh cảm lạnh thông thường",
    "example": "Từ loại: Cụm danh từ | Phiên âm: ˌkɒm.ən ˈkəʊld/",
    "status": "new"
  },
  {
    "id": "oxford-420",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Monitor",
    "answer": "Màn hình",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɒn.ɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-421",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Mouse pad",
    "answer": "Tấm lót chuột",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmaʊs ˌpæd/",
    "status": "new"
  },
  {
    "id": "oxford-422",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Printer",
    "answer": "Máy in",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈprɪn.tər/",
    "status": "new"
  },
  {
    "id": "oxford-423",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Scanner",
    "answer": "Máy quét",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈskæn.ər/",
    "status": "new"
  },
  {
    "id": "oxford-424",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Open",
    "answer": "Khởi động, mở",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈəʊ.pən/",
    "status": "new"
  },
  {
    "id": "oxford-425",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Close",
    "answer": "Đóng, tắt",
    "example": "Từ loại: Động từ (v) | Phiên âm: /kləʊz/",
    "status": "new"
  },
  {
    "id": "oxford-426",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Delete",
    "answer": "Xóa, loại bỏ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /dɪˈliːt/",
    "status": "new"
  },
  {
    "id": "oxford-427",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Insert",
    "answer": "Cho vào, chèn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ɪnˈsɜːt/",
    "status": "new"
  },
  {
    "id": "oxford-428",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Merge",
    "answer": "Sát nhập",
    "example": "Từ loại: Động từ (v) | Phiên âm: /mɜːdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-429",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Helpline",
    "answer": "Đường dây trợ giúp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhelp.laɪn/",
    "status": "new"
  },
  {
    "id": "oxford-430",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Hard disk",
    "answer": "Ổ cứng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈhɑːd ˌdɪsk/",
    "status": "new"
  },
  {
    "id": "oxford-431",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Software",
    "answer": "Phần mềm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɒft.weər/",
    "status": "new"
  },
  {
    "id": "oxford-432",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "CD-ROM",
    "answer": "Đĩa CD dữ liệu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌsiː.diːˈrɒm/",
    "status": "new"
  },
  {
    "id": "oxford-433",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Toolbar",
    "answer": "Thanh công cụ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtuːl.bɑːr/",
    "status": "new"
  },
  {
    "id": "oxford-434",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Database",
    "answer": "Cơ sở dữ liệu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdeɪ.tə.beɪs/",
    "status": "new"
  },
  {
    "id": "oxford-435",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Hacker",
    "answer": "Tin tặc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhæk.ər/",
    "status": "new"
  },
  {
    "id": "oxford-436",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Save",
    "answer": "Lưu",
    "example": "Từ loại: Động từ (v) | Phiên âm: /seɪv æz/",
    "status": "new"
  },
  {
    "id": "oxford-437",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Select",
    "answer": "Chọn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sɪˈlekt/",
    "status": "new"
  },
  {
    "id": "oxford-438",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Copy",
    "answer": "Sao chép",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈkɒp.i/",
    "status": "new"
  },
  {
    "id": "oxford-439",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Computer",
    "answer": "Máy vi tính",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəmˈpjuː.tər/",
    "status": "new"
  },
  {
    "id": "oxford-440",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Laptop",
    "answer": "Máy tính xách tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlæp.tɒp/",
    "status": "new"
  },
  {
    "id": "oxford-441",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Speaker",
    "answer": "Loa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈspiː.kər/",
    "status": "new"
  },
  {
    "id": "oxford-442",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "File",
    "answer": "Tệp, tập tin",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /faɪl/",
    "status": "new"
  },
  {
    "id": "oxford-443",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Disk drive",
    "answer": "Ổ đĩa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈdɪsk ˌdraɪv/",
    "status": "new"
  },
  {
    "id": "oxford-444",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Battery",
    "answer": "Pin",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbæt.ər.i/",
    "status": "new"
  },
  {
    "id": "oxford-445",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Click",
    "answer": "Nhấp chuột",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klɪk/",
    "status": "new"
  },
  {
    "id": "oxford-446",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Type",
    "answer": "Đánh chữ, gõ chữ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /taɪp/",
    "status": "new"
  },
  {
    "id": "oxford-447",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Mouse",
    "answer": "Con chuột",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /maʊs/",
    "status": "new"
  },
  {
    "id": "oxford-448",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Keyboard",
    "answer": "Bàn phím",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkiː.bɔːd/",
    "status": "new"
  },
  {
    "id": "oxford-449",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Mouse mat",
    "answer": "Miếng lót chuột",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmaʊs ˌmæt/",
    "status": "new"
  },
  {
    "id": "oxford-450",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Key",
    "answer": "Phím",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kiː/",
    "status": "new"
  },
  {
    "id": "oxford-451",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Shut down",
    "answer": "Tắt máy",
    "example": "Từ loại: phrasal v | Phiên âm: /ʃʌt daʊn/",
    "status": "new"
  },
  {
    "id": "oxford-452",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Folder",
    "answer": "Thư mục",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfəʊl.dər/",
    "status": "new"
  },
  {
    "id": "oxford-453",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Print",
    "answer": "In",
    "example": "Từ loại: Động từ (v) | Phiên âm: /prɪnt/",
    "status": "new"
  },
  {
    "id": "oxford-454",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Program",
    "answer": "Chương trình",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈprəʊ.ɡræm/",
    "status": "new"
  },
  {
    "id": "oxford-455",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Search",
    "answer": "Tìm kiếm (thông tin)",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sɜːtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-456",
    "category": "english",
    "subCategory": "Máy tính",
    "question": "Screen",
    "answer": "Màn hình",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skriːn/",
    "status": "new"
  },
  {
    "id": "oxford-457",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Dusting",
    "answer": "Việc quét bụi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʌs.tɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-458",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Cooking",
    "answer": "Việc nấu ăn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʊk.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-459",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Ironing",
    "answer": "Việc ủi đồ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈaɪə.nɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-460",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Sweep",
    "answer": "Quét dọn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /swiːp/",
    "status": "new"
  },
  {
    "id": "oxford-461",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Wipe",
    "answer": "Chùi, lau sạch",
    "example": "Từ loại: Động từ (v) | Phiên âm: /waɪp/",
    "status": "new"
  },
  {
    "id": "oxford-462",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Throw out",
    "answer": "Vứt, bỏ đi",
    "example": "Từ loại: phrasal v | Phiên âm: /θrəʊ aʊt/",
    "status": "new"
  },
  {
    "id": "oxford-463",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Vacuum",
    "answer": "Hút bụi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈvæk.juːm/",
    "status": "new"
  },
  {
    "id": "oxford-464",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Cleaning",
    "answer": "Việc dọn dẹp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkliː.nɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-465",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Polish",
    "answer": "Đánh bóng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈpɒl.ɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-466",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Fold",
    "answer": "Gấp gọn, gập lại",
    "example": "Từ loại: Động từ (v) | Phiên âm: /fəʊld/",
    "status": "new"
  },
  {
    "id": "oxford-467",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Scrub",
    "answer": "Chà, cọ rửa",
    "example": "Từ loại: Động từ (v) | Phiên âm: /skrʌb/",
    "status": "new"
  },
  {
    "id": "oxford-468",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Tighten",
    "answer": "Thắt, vặn (chặt)",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈtaɪ.tən/",
    "status": "new"
  },
  {
    "id": "oxford-469",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Make the bed",
    "answer": "Dọn giường",
    "example": "Từ loại: Cụm động từ | Phiên âm: /meɪk ðə bed/",
    "status": "new"
  },
  {
    "id": "oxford-470",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Set the table",
    "answer": "Bày chén bát",
    "example": "Từ loại: Cụm động từ | Phiên âm: /set ðəˈteɪ.bəl/",
    "status": "new"
  },
  {
    "id": "oxford-471",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Clear the table",
    "answer": "Dọn dẹp chén bát",
    "example": "Từ loại: Cụm động từ | Phiên âm: /klɪər ðəˈteɪ.bəl/",
    "status": "new"
  },
  {
    "id": "oxford-472",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Mow the lawn",
    "answer": "Cắt cỏ",
    "example": "Từ loại: Cụm động từ | Phiên âm: /məʊ ðə lɔːn/",
    "status": "new"
  },
  {
    "id": "oxford-473",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Dishwashing",
    "answer": "Việc rửa chén",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪʃˈwɒʃ.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-474",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Water the plants",
    "answer": "Tưới cây",
    "example": "Từ loại: Cụm động từ | Phiên âm: /ˈwɔː.tər ðəˈplɑːnt/",
    "status": "new"
  },
  {
    "id": "oxford-475",
    "category": "english",
    "subCategory": "Công việc nhà",
    "question": "Clean the kitchen",
    "answer": "Lau dọn bếp",
    "example": "Từ loại: Cụm động từ | Phiên âm: /kliːn ðə ˈkɪʧən/",
    "status": "new"
  },
  {
    "id": "oxford-476",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Bakery",
    "answer": "Tiệm bánh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbeɪ.kər.i/",
    "status": "new"
  },
  {
    "id": "oxford-477",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Bookshop",
    "answer": "Tiệm sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʊk.ʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-478",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Butcher's",
    "answer": "Cửa hàng thịt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʊtʃ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-479",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Candy store",
    "answer": "Cửa hàng kẹo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkæn.di ˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-480",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Convenience store",
    "answer": "Cửa hàng tiện lợi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /kənˈviː.ni.əns ˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-481",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Greengrocer",
    "answer": "Cửa hàng bán rau quả",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡriːŋ.ɡrəʊ.sər/",
    "status": "new"
  },
  {
    "id": "oxford-482",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Flower shop",
    "answer": "Cửa hàng hoa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /flaʊər ʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-483",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Store",
    "answer": "Cửa hàng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-484",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Gift shop",
    "answer": "Cửa hàng đồ lưu niệm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɡɪft ˌʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-485",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Shop",
    "answer": "Cửa hàng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-486",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Food stall",
    "answer": "Quán ăn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /fuːd stɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-487",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Fast food restaurant",
    "answer": "Cửa hàng thức ăn nhanh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌfɑːst ˈfuːd ˌres.trɒnt/",
    "status": "new"
  },
  {
    "id": "oxford-488",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Dry-cleaner's",
    "answer": "Tiệm giặt ủi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌdraɪˈkliː.nəz/",
    "status": "new"
  },
  {
    "id": "oxford-489",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Shoe store",
    "answer": "Tiệm giày",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ʃuːˌstɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-490",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Barbershop",
    "answer": "Tiệm cắt tóc nam",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɑː.bə.ʃɒp/",
    "status": "new"
  },
  {
    "id": "oxford-491",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Newspaper kiosk",
    "answer": "Sạp báo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈnjuːzˌpeɪ.pər ˈkiː.ɒsk/",
    "status": "new"
  },
  {
    "id": "oxford-492",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Bookstall",
    "answer": "Quầy bán sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʊk.stɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-493",
    "category": "english",
    "subCategory": "Cửa hàng",
    "question": "Sports center",
    "answer": "Trung tâm thể thao",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈspɔːrts ˌsen.t̬ɚ/",
    "status": "new"
  },
  {
    "id": "oxford-494",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Play",
    "answer": "Vở kịch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pleɪ/",
    "status": "new"
  },
  {
    "id": "oxford-495",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Circus",
    "answer": "Rạp xiếc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɜː.kəs/",
    "status": "new"
  },
  {
    "id": "oxford-496",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Stadium",
    "answer": "Sân vận động",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsteɪ.di.əm/",
    "status": "new"
  },
  {
    "id": "oxford-497",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Orchestra",
    "answer": "Ban nhạc, dàn nhạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɔː.kɪ.strə/",
    "status": "new"
  },
  {
    "id": "oxford-498",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Scene",
    "answer": "Phân cảnh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /siːn/",
    "status": "new"
  },
  {
    "id": "oxford-499",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Opera",
    "answer": "Nhạc kịch, ô-pê-ra",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɒp.ər.ə/",
    "status": "new"
  },
  {
    "id": "oxford-500",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Theater",
    "answer": "Nhà hát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈθɪə.tər/",
    "status": "new"
  },
  {
    "id": "oxford-501",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Applaud",
    "answer": "Vỗ tay (tán thưởng)",
    "example": "Từ loại: Động từ (v) | Phiên âm: /əˈplɔːd/",
    "status": "new"
  },
  {
    "id": "oxford-502",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Perform",
    "answer": "Trình diễn, biểu diễn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pəˈfɔːm/",
    "status": "new"
  },
  {
    "id": "oxford-503",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Exhibit",
    "answer": "Vật triển lãm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪɡˈzɪb.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-504",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Art gallery",
    "answer": "Phòng triển lãm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɑːt ˌɡæl.ər.i/",
    "status": "new"
  },
  {
    "id": "oxford-505",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Comedy",
    "answer": "Hài kịch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒm.ə.di/",
    "status": "new"
  },
  {
    "id": "oxford-506",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Chamber music",
    "answer": "Nhạc thính phòng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtʃeɪm.bə ˌmjuː.zɪk/",
    "status": "new"
  },
  {
    "id": "oxford-507",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Casino",
    "answer": "Sòng bạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəˈsiː.nəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-508",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Pub",
    "answer": "Quán rượu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pʌb/",
    "status": "new"
  },
  {
    "id": "oxford-509",
    "category": "english",
    "subCategory": "Giải trí",
    "question": "Concert hall",
    "answer": "Phòng hoà nhạc",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɒn.sət ˌhɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-510",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Travel",
    "answer": "Du lịch",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈtræv.əl/",
    "status": "new"
  },
  {
    "id": "oxford-511",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Travel agent",
    "answer": "Đại lý du lịch",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtræv.əl ˌeɪ.dʒənt/",
    "status": "new"
  },
  {
    "id": "oxford-512",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Vacation",
    "answer": "Kỳ nghỉ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /veɪˈkeɪ.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-513",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Flight",
    "answer": "Chuyến bay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /flaɪt/",
    "status": "new"
  },
  {
    "id": "oxford-514",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Voyage",
    "answer": "Chuyến hải hành",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈvɔɪ.ɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-515",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Relax",
    "answer": "Thư giãn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /rɪˈlæks/",
    "status": "new"
  },
  {
    "id": "oxford-516",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Cancel",
    "answer": "Hủy bỏ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈkæn.səl/",
    "status": "new"
  },
  {
    "id": "oxford-517",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Homestay",
    "answer": "(dịch vụ) lưu trú tại nhà dân bản địa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhəʊm.steɪ/",
    "status": "new"
  },
  {
    "id": "oxford-518",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Souvenir",
    "answer": "Quà lưu niệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌsuː.vənˈɪər/",
    "status": "new"
  },
  {
    "id": "oxford-519",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Travel sickness",
    "answer": "Việc say tàu xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtræv.əl ˌsɪk.nəs/",
    "status": "new"
  },
  {
    "id": "oxford-520",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Journey",
    "answer": "Chuyến đi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒɜː.ni/",
    "status": "new"
  },
  {
    "id": "oxford-521",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Peak season",
    "answer": "Mùa cao điểm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /piːk ˈsiː.zən/",
    "status": "new"
  },
  {
    "id": "oxford-522",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Route",
    "answer": "Tuyến đường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ruːt/",
    "status": "new"
  },
  {
    "id": "oxford-523",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Trip",
    "answer": "Chuyến đi (ngắn ngày)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /trɪp/",
    "status": "new"
  },
  {
    "id": "oxford-524",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Excursion",
    "answer": "Chuyến tham quan",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪkˈskɜː.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-525",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Luggage",
    "answer": "Hành lý",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlʌɡ.ɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-526",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Tourist",
    "answer": "Du khách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʊə.rɪst/",
    "status": "new"
  },
  {
    "id": "oxford-527",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Ticket",
    "answer": "Vé",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɪk.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-528",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Eager",
    "answer": "Háo hức",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈiː.ɡər/",
    "status": "new"
  },
  {
    "id": "oxford-529",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Sunglasses",
    "answer": "Kính mát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsʌŋˌɡlɑː.sɪz/",
    "status": "new"
  },
  {
    "id": "oxford-530",
    "category": "english",
    "subCategory": "Du lịch",
    "question": "Safari",
    "answer": "Chuyến thám hiểm thiên nhiên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /səˈfɑː.ri/",
    "status": "new"
  },
  {
    "id": "oxford-531",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Mid-Autumn Festival",
    "answer": "Tết Trung thu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /mɪd ˈɔː.təm ˈfes.tɪ.vəl/",
    "status": "new"
  },
  {
    "id": "oxford-532",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Moon",
    "answer": "Trăng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /muːn/",
    "status": "new"
  },
  {
    "id": "oxford-533",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Cake",
    "answer": "Bánh ngọt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /keɪk/",
    "status": "new"
  },
  {
    "id": "oxford-534",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Toy",
    "answer": "Đồ chơi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / tɔɪ /",
    "status": "new"
  },
  {
    "id": "oxford-535",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Mask",
    "answer": "Mặt nạ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɑːsk/",
    "status": "new"
  },
  {
    "id": "oxford-536",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Banyan",
    "answer": "Cây đa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbæn.jæn/",
    "status": "new"
  },
  {
    "id": "oxford-537",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Lantern",
    "answer": "Lồng đèn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlæn.tən/",
    "status": "new"
  },
  {
    "id": "oxford-538",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Bamboo",
    "answer": "Tre",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bæmˈbuː/",
    "status": "new"
  },
  {
    "id": "oxford-539",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Perform",
    "answer": "Trình diễn, biểu diễn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pəˈfɔːm/",
    "status": "new"
  },
  {
    "id": "oxford-540",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Celebrate",
    "answer": "Kỷ niệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsel.ə.breɪt/",
    "status": "new"
  },
  {
    "id": "oxford-541",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Family reunion",
    "answer": "Họp mặt gia đình",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfæm.əl.i ˌriːˈjuː.njən/",
    "status": "new"
  },
  {
    "id": "oxford-542",
    "category": "english",
    "subCategory": "Tết trung thu",
    "question": "Rabbit",
    "answer": "Thỏ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈræb.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-543",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Sport",
    "answer": "Thể thao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /spɔːrt/",
    "status": "new"
  },
  {
    "id": "oxford-544",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Skiing",
    "answer": "Trượt tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈskiː.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-545",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Ice skating",
    "answer": "Trượt băng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈaɪs ˌskeɪ.tɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-546",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Horse racing",
    "answer": "Đua ngựa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈhɔːrs ˌreɪ.sɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-547",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Running",
    "answer": "Chạy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrʌn.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-548",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Walking",
    "answer": "Đi bộ, tản bộ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔː.kɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-549",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Water sports",
    "answer": "Thể thao dưới nước",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈwɔː.tər spɔːrts/",
    "status": "new"
  },
  {
    "id": "oxford-550",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Boxing",
    "answer": "Quyền anh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɒk.sɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-551",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Swimming",
    "answer": "Bơi lội",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈswɪm.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-552",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Football",
    "answer": "Bóng đá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfʊt.bɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-553",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Basketball",
    "answer": "Bóng rổ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbæs.kɪtˌbɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-554",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Badminton",
    "answer": "Cầu lông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbæd.mɪn.tən/",
    "status": "new"
  },
  {
    "id": "oxford-555",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Tennis",
    "answer": "Quần vợt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɛn.ɪs/",
    "status": "new"
  },
  {
    "id": "oxford-556",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Table tennis",
    "answer": "Bóng bàn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈteɪ.bəl ˈtɛn.ɪs/",
    "status": "new"
  },
  {
    "id": "oxford-557",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Baseball",
    "answer": "Bóng chày",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbeɪs.bɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-558",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Cycling",
    "answer": "Đua xe đạp, đạp xe",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsaɪ.klɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-559",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Golf",
    "answer": "Đánh gôn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡɑːlf/",
    "status": "new"
  },
  {
    "id": "oxford-560",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Contact sport",
    "answer": "Thể thao tiếp xúc",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɒn.tækt spɔːrt/",
    "status": "new"
  },
  {
    "id": "oxford-561",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Water polo",
    "answer": "Bóng nước",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈwɔː.tər ˈpoʊ.loʊ/",
    "status": "new"
  },
  {
    "id": "oxford-562",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Archery",
    "answer": "Bắn cung",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɑːr.tʃər.i/",
    "status": "new"
  },
  {
    "id": "oxford-563",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Weightlifting",
    "answer": "Cử tạ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈweɪtˌlɪf.tɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-564",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Wrestling",
    "answer": "Đấu vật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrɛs.lɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-565",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Bowling",
    "answer": "Bóng gỗ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈboʊ.lɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-566",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Lacrosse",
    "answer": "Bóng vợt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ləˈkrɒs/",
    "status": "new"
  },
  {
    "id": "oxford-567",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Hockey",
    "answer": "Khúc côn cầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɒk.i/",
    "status": "new"
  },
  {
    "id": "oxford-568",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Referee",
    "answer": "Trọng tài",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌrɛf.əˈriː/",
    "status": "new"
  },
  {
    "id": "oxford-569",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Dart",
    "answer": "Ném phi tiêu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɑːrt/",
    "status": "new"
  },
  {
    "id": "oxford-570",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Synchronized swimming",
    "answer": "Bơi nghệ thuật",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsɪŋ.krə.naɪzd ˈswɪm.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-571",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "SEA Games",
    "answer": "Đại hội Thể thao Đông Nam Á",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsiː ˌɡeɪmz/",
    "status": "new"
  },
  {
    "id": "oxford-572",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Host",
    "answer": "Đăng cai, tổ chức",
    "example": "Từ loại: Động từ (v) | Phiên âm: /hoʊst/",
    "status": "new"
  },
  {
    "id": "oxford-573",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Wushu",
    "answer": "(môn) võ wushu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwuː.ʃuː/",
    "status": "new"
  },
  {
    "id": "oxford-574",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Sportsmanship",
    "answer": "Tinh thần thể thao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈspɔːrts.mənˌʃɪp/",
    "status": "new"
  },
  {
    "id": "oxford-575",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Captain",
    "answer": "Đội trưởng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæp.tən/",
    "status": "new"
  },
  {
    "id": "oxford-576",
    "category": "english",
    "subCategory": "Thể thao",
    "question": "Cross-country",
    "answer": "Chạy việt dã",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌkrɒsˈkʌn.tri/",
    "status": "new"
  },
  {
    "id": "oxford-577",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Village",
    "answer": "Ngôi làng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈvɪl.ɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-578",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Countryside",
    "answer": "Nông thôn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌn.tri.saɪd/",
    "status": "new"
  },
  {
    "id": "oxford-579",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Cottage",
    "answer": "Nhà tranh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒt.ɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-580",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Winding",
    "answer": "Quanh co, uốn khúc",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈwaɪn.dɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-581",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Well",
    "answer": "Giếng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /wel/",
    "status": "new"
  },
  {
    "id": "oxford-582",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Buffalo",
    "answer": "Con trâu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʌf.ə.ləʊ/",
    "status": "new"
  },
  {
    "id": "oxford-583",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Field",
    "answer": "Cánh đồng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fiːld/",
    "status": "new"
  },
  {
    "id": "oxford-584",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Canal",
    "answer": "Kênh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəˈnæl/",
    "status": "new"
  },
  {
    "id": "oxford-585",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "River",
    "answer": "Sông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrɪv.ər/",
    "status": "new"
  },
  {
    "id": "oxford-586",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Pond",
    "answer": "Ao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɒnd/",
    "status": "new"
  },
  {
    "id": "oxford-587",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Folk music",
    "answer": "Nhạc dân gian",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfoʊk ˌmju·zɪk/",
    "status": "new"
  },
  {
    "id": "oxford-588",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Farm",
    "answer": "Trang trại",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fɑːm/",
    "status": "new"
  },
  {
    "id": "oxford-589",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Plow",
    "answer": "Cày",
    "example": "Từ loại: Động từ (v) | Phiên âm: /plaʊ/",
    "status": "new"
  },
  {
    "id": "oxford-590",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Agriculture",
    "answer": "Nông nghiệp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæɡ.rɪ.kʌl.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-591",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Boat",
    "answer": "Thuyền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bəʊt/",
    "status": "new"
  },
  {
    "id": "oxford-592",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Peaceful",
    "answer": "Yên bình",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈpiːs.fəl/",
    "status": "new"
  },
  {
    "id": "oxford-593",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Bay",
    "answer": "Vịnh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /beɪ/",
    "status": "new"
  },
  {
    "id": "oxford-594",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Hill",
    "answer": "Ngọn đồi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɪl/",
    "status": "new"
  },
  {
    "id": "oxford-595",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Forest",
    "answer": "Rừng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɒr.ɪst/",
    "status": "new"
  },
  {
    "id": "oxford-596",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Mountain",
    "answer": "Núi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmaʊn.tɪn/",
    "status": "new"
  },
  {
    "id": "oxford-597",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Port",
    "answer": "Bến cảng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɔːt/",
    "status": "new"
  },
  {
    "id": "oxford-598",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Lake",
    "answer": "Hồ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /leɪk/",
    "status": "new"
  },
  {
    "id": "oxford-599",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Sea",
    "answer": "Biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /siː/",
    "status": "new"
  },
  {
    "id": "oxford-600",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Sand",
    "answer": "Cát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sænd/",
    "status": "new"
  },
  {
    "id": "oxford-601",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Valley",
    "answer": "Thung lũng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈvæl.i/",
    "status": "new"
  },
  {
    "id": "oxford-602",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Waterfall",
    "answer": "Thác nước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔː.tə.fɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-603",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Barn",
    "answer": "Kho thóc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɑːn/",
    "status": "new"
  },
  {
    "id": "oxford-604",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Harvest",
    "answer": "Vụ gặt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɑː.vɪst/",
    "status": "new"
  },
  {
    "id": "oxford-605",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Cattle",
    "answer": "Gia súc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæt.əl/",
    "status": "new"
  },
  {
    "id": "oxford-606",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Rural",
    "answer": "(thuộc) nông thôn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈrʊə.rəl/",
    "status": "new"
  },
  {
    "id": "oxford-607",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Cliff",
    "answer": "Vách đá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klɪf/",
    "status": "new"
  },
  {
    "id": "oxford-608",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Landscape",
    "answer": "Phong cảnh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlænd.skeɪp/",
    "status": "new"
  },
  {
    "id": "oxford-609",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "Terraced house",
    "answer": "Dãy nhà",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈrəʊˌhaʊs/",
    "status": "new"
  },
  {
    "id": "oxford-610",
    "category": "english",
    "subCategory": "Quê hương",
    "question": "View",
    "answer": "Khung cảnh, quang cảnh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /vjuː/",
    "status": "new"
  },
  {
    "id": "oxford-611",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Bride",
    "answer": "Cô dâu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /braɪd/",
    "status": "new"
  },
  {
    "id": "oxford-612",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Vow",
    "answer": "Lời thề",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /vaʊ/",
    "status": "new"
  },
  {
    "id": "oxford-613",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Groomsman",
    "answer": "Phù rể",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡruːmz.mən/",
    "status": "new"
  },
  {
    "id": "oxford-614",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Groom",
    "answer": "Chú rể",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡruːm/",
    "status": "new"
  },
  {
    "id": "oxford-615",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Tuxedo",
    "answer": "Áo ximôckinh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʌkˈsiː.dəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-616",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Party",
    "answer": "Bữa tiệc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɑː.ti/",
    "status": "new"
  },
  {
    "id": "oxford-617",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Wedding",
    "answer": "Đám cưới",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwed.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-618",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Wedding card",
    "answer": "Thiệp mời đám cưới",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈwed.ɪŋ kɑːd/",
    "status": "new"
  },
  {
    "id": "oxford-619",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Reception",
    "answer": "Tiệc chiêu đãi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪˈsep.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-620",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Champagne",
    "answer": "Rượu sâm panh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃæmˈpeɪn/",
    "status": "new"
  },
  {
    "id": "oxford-621",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Bouquet",
    "answer": "Bó hoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /buˈkeɪ/",
    "status": "new"
  },
  {
    "id": "oxford-622",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Married",
    "answer": "Đã kết hôn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈmær.id/",
    "status": "new"
  },
  {
    "id": "oxford-623",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Newlywed",
    "answer": "Người mới cưới",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnjuː.li.wed/",
    "status": "new"
  },
  {
    "id": "oxford-624",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Cake",
    "answer": "Bánh ngọt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /keɪk/",
    "status": "new"
  },
  {
    "id": "oxford-625",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Ring",
    "answer": "Nhẫn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-626",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Emblem",
    "answer": "Biểu tượng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈem.bləm/",
    "status": "new"
  },
  {
    "id": "oxford-627",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Band",
    "answer": "Ban nhạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bænd/",
    "status": "new"
  },
  {
    "id": "oxford-628",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Congratulation",
    "answer": "Lời chúc mừng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kənˌɡrætʃ.əˈleɪ.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-629",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Jewelry",
    "answer": "Trang sức",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒuː.əl.ri/",
    "status": "new"
  },
  {
    "id": "oxford-630",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Wine",
    "answer": "Rượu vang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /waɪn/",
    "status": "new"
  },
  {
    "id": "oxford-631",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Dowry",
    "answer": "Của hồi môn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdaʊ.ri/",
    "status": "new"
  },
  {
    "id": "oxford-632",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Honeymoon",
    "answer": "Tuần trăng mật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhʌn.i.muːn/",
    "status": "new"
  },
  {
    "id": "oxford-633",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Anniversary",
    "answer": "Ngày kỷ niệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌæn.ɪˈvɜː.sər.i/",
    "status": "new"
  },
  {
    "id": "oxford-634",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Brother-in-law",
    "answer": "Anh/em rể, anh/em chồng, anh/em vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbrʌð.ə.rɪn.lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-635",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Sister-in-law",
    "answer": "Chị/em dâu, chị/em chồng, chị/em vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɪs.tə.rɪn.lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-636",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Engaged",
    "answer": "Đã đính ước, hứa hôn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ɪnˈɡeɪdʒd/",
    "status": "new"
  },
  {
    "id": "oxford-637",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Couple",
    "answer": "Cặp đôi, đôi vợ chồng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌp.əl/",
    "status": "new"
  },
  {
    "id": "oxford-638",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Husband",
    "answer": "Chồng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhʌz.bənd/",
    "status": "new"
  },
  {
    "id": "oxford-639",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Wife",
    "answer": "Vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /waɪf/",
    "status": "new"
  },
  {
    "id": "oxford-640",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Ceremony",
    "answer": "Nghi lễ, nghi thức",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈser.ɪ.mə.ni/",
    "status": "new"
  },
  {
    "id": "oxford-641",
    "category": "english",
    "subCategory": "Đám cưới",
    "question": "Betroth",
    "answer": "Hứa hôn, đính hôn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /bɪˈtrəʊð/",
    "status": "new"
  },
  {
    "id": "oxford-642",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Switch off",
    "answer": "Tắt",
    "example": "Từ loại: phrasal v | Phiên âm: /swɪtʃ ɒf/",
    "status": "new"
  },
  {
    "id": "oxford-643",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Lavatory",
    "answer": "Phòng vệ sinh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlæv.ə.tər.i/",
    "status": "new"
  },
  {
    "id": "oxford-644",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Blanket",
    "answer": "Tấm chăn, mền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈblæŋ.kɪt/",
    "status": "new"
  },
  {
    "id": "oxford-645",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Oxygen mask",
    "answer": "Mặt nạ thở oxy",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɒk.sɪ.dʒən ˌmɑːsk/",
    "status": "new"
  },
  {
    "id": "oxford-646",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Serve",
    "answer": "Phục vụ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sɜːv/",
    "status": "new"
  },
  {
    "id": "oxford-647",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Window seat",
    "answer": "Ghế cạnh cửa sổ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈwɪn.dəʊ ˌsiːt/",
    "status": "new"
  },
  {
    "id": "oxford-648",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Airsick",
    "answer": "Say máy bay",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈeə.sɪk/",
    "status": "new"
  },
  {
    "id": "oxford-649",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Cockpit",
    "answer": "Buồng lái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒk.pɪt/",
    "status": "new"
  },
  {
    "id": "oxford-650",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Fasten",
    "answer": "Thắt, buộc",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈfɑː.sən/",
    "status": "new"
  },
  {
    "id": "oxford-651",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Take off",
    "answer": "Cất cánh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /teɪk ɒf/",
    "status": "new"
  },
  {
    "id": "oxford-652",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Co-pilot",
    "answer": "Phi công phụ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkəʊˌpaɪ.lət/",
    "status": "new"
  },
  {
    "id": "oxford-653",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Assist",
    "answer": "Hỗ trợ, giúp đỡ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /əˈsɪst/",
    "status": "new"
  },
  {
    "id": "oxford-654",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "First-class",
    "answer": "(ghế) hạng nhất",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌfɜːst ˈklɑːs/",
    "status": "new"
  },
  {
    "id": "oxford-655",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Confiscate",
    "answer": "Tịch thu",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈkɒn.fɪ.skeɪt/",
    "status": "new"
  },
  {
    "id": "oxford-656",
    "category": "english",
    "subCategory": "Sân bay",
    "question": "Turn on",
    "answer": "Bật, mở",
    "example": "Từ loại: phrasal v | Phiên âm: /tɜːn ɒn/",
    "status": "new"
  },
  {
    "id": "oxford-657",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Fever",
    "answer": "Sốt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfiːvɚ/",
    "status": "new"
  },
  {
    "id": "oxford-658",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Cough",
    "answer": "Ho",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɔf/",
    "status": "new"
  },
  {
    "id": "oxford-659",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Hurt",
    "answer": "Đau",
    "example": "Từ loại: Động từ (v) | Phiên âm: /hɜːt/",
    "status": "new"
  },
  {
    "id": "oxford-660",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Swollen",
    "answer": "Bị sưng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈswoʊlən/",
    "status": "new"
  },
  {
    "id": "oxford-661",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Pus",
    "answer": "Mủ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pʌs/",
    "status": "new"
  },
  {
    "id": "oxford-662",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Graze",
    "answer": "Trầy xước (da)",
    "example": "Từ loại: Động từ (v) | Phiên âm: /Greiz/",
    "status": "new"
  },
  {
    "id": "oxford-663",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Headache",
    "answer": "Đau đầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɛdeɪk/",
    "status": "new"
  },
  {
    "id": "oxford-664",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Insomnia",
    "answer": "Chứng mất ngủ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪnˈsɑːmniə/",
    "status": "new"
  },
  {
    "id": "oxford-665",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Rash",
    "answer": "Phát ban",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ræʃ/",
    "status": "new"
  },
  {
    "id": "oxford-666",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Black eye",
    "answer": "Thâm mắt",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /blæk aɪ/",
    "status": "new"
  },
  {
    "id": "oxford-667",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Bruise",
    "answer": "Vết thâm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bruːz/",
    "status": "new"
  },
  {
    "id": "oxford-668",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Constipation",
    "answer": "Táo bón",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌkɑːnstɪˈpeɪʃn/",
    "status": "new"
  },
  {
    "id": "oxford-669",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Diarrhea",
    "answer": "Tiêu chảy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌdaɪəˈriːə/",
    "status": "new"
  },
  {
    "id": "oxford-670",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Sore eyes",
    "answer": "Đau mắt",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /’so:r ais/",
    "status": "new"
  },
  {
    "id": "oxford-671",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Runny nose",
    "answer": "Sổ mũi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /rʌniɳ nəʊz/",
    "status": "new"
  },
  {
    "id": "oxford-672",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Sniffle",
    "answer": "Sổ mũi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sniflz/",
    "status": "new"
  },
  {
    "id": "oxford-673",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Sneeze",
    "answer": "Hắt hơi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sni:z/",
    "status": "new"
  },
  {
    "id": "oxford-674",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Bad breath",
    "answer": "Hôi miệng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /bæd breθ/",
    "status": "new"
  },
  {
    "id": "oxford-675",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Earache",
    "answer": "Đau tai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /’iəreik/",
    "status": "new"
  },
  {
    "id": "oxford-676",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Nausea",
    "answer": "Chứng buồn nôn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /’nɔ:sjə/",
    "status": "new"
  },
  {
    "id": "oxford-677",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Eating disorder",
    "answer": "Rối loạn ăn uống",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈiːtɪŋ dɪsˈɔːrdər/",
    "status": "new"
  },
  {
    "id": "oxford-678",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Asthma",
    "answer": "Hen, suyễn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæzmə/",
    "status": "new"
  },
  {
    "id": "oxford-679",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Backache",
    "answer": "Bệnh đau lưng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbækeɪk bəʊn/",
    "status": "new"
  },
  {
    "id": "oxford-680",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Chill",
    "answer": "Cảm lạnh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɪl/",
    "status": "new"
  },
  {
    "id": "oxford-681",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Fever virus",
    "answer": "Sốt siêu vi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /’fi:və ‘vaiərəs/",
    "status": "new"
  },
  {
    "id": "oxford-682",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Allergy",
    "answer": "Dị ứng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈælərdʒi/",
    "status": "new"
  },
  {
    "id": "oxford-683",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Paralyse",
    "answer": "Liệt",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈpærəlaɪz/",
    "status": "new"
  },
  {
    "id": "oxford-684",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Infected",
    "answer": "Nhiễm trùng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /in’dʤekʃn/",
    "status": "new"
  },
  {
    "id": "oxford-685",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Inflamed",
    "answer": "Bị viêm",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ɪnˈfleɪmd/",
    "status": "new"
  },
  {
    "id": "oxford-686",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Gout",
    "answer": "Bệnh Gút",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡaʊt/",
    "status": "new"
  },
  {
    "id": "oxford-687",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Hepatitis",
    "answer": "Viêm gan",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌhepəˈtaɪtɪs/",
    "status": "new"
  },
  {
    "id": "oxford-688",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Lump",
    "answer": "U bướu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /lʌmp/",
    "status": "new"
  },
  {
    "id": "oxford-689",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Insect bite",
    "answer": "Côn trùng đốt",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɪn.sekt baɪt/",
    "status": "new"
  },
  {
    "id": "oxford-690",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Stomachache",
    "answer": "Đau dạ dày",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstʌmək-eɪk/",
    "status": "new"
  },
  {
    "id": "oxford-691",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Toothache",
    "answer": "Đau răng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtuːθ.eɪk/",
    "status": "new"
  },
  {
    "id": "oxford-692",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "High blood pressure",
    "answer": "Cao huyết áp",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /haɪ blʌd ˈpreʃ.əʳ/",
    "status": "new"
  },
  {
    "id": "oxford-693",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Sore throat",
    "answer": "Viêm họng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /sɔːʳ θrəʊt/",
    "status": "new"
  },
  {
    "id": "oxford-694",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Sprain",
    "answer": "Bong gân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /spreɪn/",
    "status": "new"
  },
  {
    "id": "oxford-695",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Burn",
    "answer": "Bỏng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɜːn/",
    "status": "new"
  },
  {
    "id": "oxford-696",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Malaria",
    "answer": "Sốt rét",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /məˈleriə/",
    "status": "new"
  },
  {
    "id": "oxford-697",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Scabies",
    "answer": "Bệnh ghẻ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈskeɪbiːz/",
    "status": "new"
  },
  {
    "id": "oxford-698",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Smallpox",
    "answer": "Bệnh đậu mùa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsmɔːlpɑːks/",
    "status": "new"
  },
  {
    "id": "oxford-699",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Heart attack",
    "answer": "Nhồi máu cơ tim",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /hɑːrt əˈtæk/",
    "status": "new"
  },
  {
    "id": "oxford-700",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Tuberculosis",
    "answer": "Bệnh lao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tuːˌbɜːrkjəˈloʊsɪs/",
    "status": "new"
  },
  {
    "id": "oxford-701",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Diabetes",
    "answer": "Bệnh tiểu đường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /,daiə’bi:tiz/",
    "status": "new"
  },
  {
    "id": "oxford-702",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Cancer",
    "answer": "Bệnh ung thư",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkænsər/",
    "status": "new"
  },
  {
    "id": "oxford-703",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Pneumonia",
    "answer": "Viêm phổi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /nuːˈmoʊniə/",
    "status": "new"
  },
  {
    "id": "oxford-704",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Chicken pox",
    "answer": "Bệnh thủy đậu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtʃɪkɪn pɑːks/",
    "status": "new"
  },
  {
    "id": "oxford-705",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Depression",
    "answer": "Trầm cảm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈpreʃn/",
    "status": "new"
  },
  {
    "id": "oxford-706",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Low blood pressure",
    "answer": "Huyết áp thấp",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /loʊ blʌd ˈpreʃər/",
    "status": "new"
  },
  {
    "id": "oxford-707",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Hypertension",
    "answer": "Huyết áp cao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌhaɪ.pəˈten.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-708",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Measles",
    "answer": "Bệnh sởi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmiːzlz/",
    "status": "new"
  },
  {
    "id": "oxford-709",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Migraine",
    "answer": "Bệnh đau nửa đầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmaɪɡreɪn/",
    "status": "new"
  },
  {
    "id": "oxford-710",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Mumps",
    "answer": "Bệnh quai bị",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mʌmps/",
    "status": "new"
  },
  {
    "id": "oxford-711",
    "category": "english",
    "subCategory": "Sức khỏe",
    "question": "Rheumatism",
    "answer": "Bệnh thấp khớp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈruːmətɪzəm/",
    "status": "new"
  },
  {
    "id": "oxford-712",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Tomato",
    "answer": "Cà chua",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /təˈmɑːtəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-713",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Spinach",
    "answer": "Rau chân vịt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈspɪnɪtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-714",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Water Spinach",
    "answer": "Rau Muống",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈwɔːtə(r) ˈspɪnɪtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-715",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Thai Basil",
    "answer": "Húng Quế",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /taɪ ˈbæz.əl/",
    "status": "new"
  },
  {
    "id": "oxford-716",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Eggplant",
    "answer": "Cà tím",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈeɡplɑːnt/",
    "status": "new"
  },
  {
    "id": "oxford-717",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Beet",
    "answer": "Củ cải đường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /biːt/",
    "status": "new"
  },
  {
    "id": "oxford-718",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Pepper",
    "answer": "Ớt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpepə(r)/",
    "status": "new"
  },
  {
    "id": "oxford-719",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Cauliflower",
    "answer": "Súp lơ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /’kɔliflauə/",
    "status": "new"
  },
  {
    "id": "oxford-720",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Cilantro",
    "answer": "Rau mùi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sɪˈlæn.trəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-721",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Marrow",
    "answer": "Bí ngô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmærəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-722",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Fish Mint",
    "answer": "Diếp Cá",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfɪʃ mɪnt/",
    "status": "new"
  },
  {
    "id": "oxford-723",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Rice Paddy",
    "answer": "Ngò ôm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈraɪs ˌpæd.i/",
    "status": "new"
  },
  {
    "id": "oxford-724",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Batata",
    "answer": "Khoai lang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bæ’tɑ:tə/",
    "status": "new"
  },
  {
    "id": "oxford-725",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Asparagus",
    "answer": "Măng tây",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈspærəɡəs/",
    "status": "new"
  },
  {
    "id": "oxford-726",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Mustard Leaves",
    "answer": "Cải bẹ xanh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmʌstəd li:vz/",
    "status": "new"
  },
  {
    "id": "oxford-727",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Pumpkin buds",
    "answer": "Bông bí",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpʌmp.kɪn bʌdz/",
    "status": "new"
  },
  {
    "id": "oxford-728",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Pumpkin",
    "answer": "Bí đỏ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpʌmpkɪn/",
    "status": "new"
  },
  {
    "id": "oxford-729",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Corn",
    "answer": "Ngô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɔːn/",
    "status": "new"
  },
  {
    "id": "oxford-730",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Pepper-elder",
    "answer": "Rau càng Cua",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpepə ˈeldə(r)/",
    "status": "new"
  },
  {
    "id": "oxford-731",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Onion",
    "answer": "Củ hành",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /’ʌniən/",
    "status": "new"
  },
  {
    "id": "oxford-732",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Cress",
    "answer": "Rau cải xoong",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kres/",
    "status": "new"
  },
  {
    "id": "oxford-733",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Celery",
    "answer": "Cần tây",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈseləri/",
    "status": "new"
  },
  {
    "id": "oxford-734",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Potato",
    "answer": "Khoai tây",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pəˈteɪtəʊ/",
    "status": "new"
  },
  {
    "id": "oxford-735",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Carrot",
    "answer": "Cà rốt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkærət/",
    "status": "new"
  },
  {
    "id": "oxford-736",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Artichoke",
    "answer": "Cây atiso",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /’ɑ:tit∫ouk /",
    "status": "new"
  },
  {
    "id": "oxford-737",
    "category": "english",
    "subCategory": "Rau, củ, quả",
    "question": "Beetroot",
    "answer": "Củ dền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /’bi:tru:t/",
    "status": "new"
  },
  {
    "id": "oxford-738",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Second",
    "answer": "Giây",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsek.ənd/",
    "status": "new"
  },
  {
    "id": "oxford-739",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Minute",
    "answer": "Phút",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɪn.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-740",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Hour",
    "answer": "Tiếng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /aʊr/",
    "status": "new"
  },
  {
    "id": "oxford-741",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Week",
    "answer": "Tuần",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /wiːk/",
    "status": "new"
  },
  {
    "id": "oxford-742",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Decade",
    "answer": "Thập niên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dekˈeɪd/",
    "status": "new"
  },
  {
    "id": "oxford-743",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Century",
    "answer": "Thế kỷ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsen.tʃər.i/",
    "status": "new"
  },
  {
    "id": "oxford-744",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Weekend",
    "answer": "Cuối tuần",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwiːend/",
    "status": "new"
  },
  {
    "id": "oxford-745",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Month",
    "answer": "Tháng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mʌnθ/",
    "status": "new"
  },
  {
    "id": "oxford-746",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Year",
    "answer": "Năm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /jɪr/",
    "status": "new"
  },
  {
    "id": "oxford-747",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Millennium",
    "answer": "Thiên niên kỷ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɪˈlen.i.əm/",
    "status": "new"
  },
  {
    "id": "oxford-748",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Morning",
    "answer": "Buổi sáng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɔːnɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-749",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Afternoon",
    "answer": "Buổi chiều",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌæf.tɚˈnuːn/",
    "status": "new"
  },
  {
    "id": "oxford-750",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Evening",
    "answer": "Buổi tối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈiːnɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-751",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Midnight",
    "answer": "Nửa đêm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɪd.naɪt/",
    "status": "new"
  },
  {
    "id": "oxford-752",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Dusk",
    "answer": "Hoàng hôn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʌsk/",
    "status": "new"
  },
  {
    "id": "oxford-753",
    "category": "english",
    "subCategory": "Thời gian",
    "question": "Dawn",
    "answer": "Bình minh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɑːn/",
    "status": "new"
  },
  {
    "id": "oxford-754",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Road",
    "answer": "Đường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / roʊd /",
    "status": "new"
  },
  {
    "id": "oxford-755",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Traffic",
    "answer": "Giao thông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈtræfɪk /",
    "status": "new"
  },
  {
    "id": "oxford-756",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Vehicle",
    "answer": "Phương tiện",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈviːəkl /",
    "status": "new"
  },
  {
    "id": "oxford-757",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Roadside",
    "answer": "Lề đường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈroʊdsaɪd /",
    "status": "new"
  },
  {
    "id": "oxford-758",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Car hire",
    "answer": "Việc thuê xe ô tô",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / kɑːr ˈhaɪər /",
    "status": "new"
  },
  {
    "id": "oxford-759",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Ring road",
    "answer": "Đường vành đai",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / rɪŋ roʊd/",
    "status": "new"
  },
  {
    "id": "oxford-760",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Petrol station",
    "answer": "Trạm xăng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈpetrəl ˈsteɪʃn /",
    "status": "new"
  },
  {
    "id": "oxford-761",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Kerb",
    "answer": "Lề đường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / kɜːrb /",
    "status": "new"
  },
  {
    "id": "oxford-762",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Road sign",
    "answer": "Biển báo giao thông",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / roʊd saɪn /",
    "status": "new"
  },
  {
    "id": "oxford-763",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Pedestrian crossing",
    "answer": "Lối qua đường",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / pəˈdestriən ˈkrɔːsɪŋ /",
    "status": "new"
  },
  {
    "id": "oxford-764",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Turning",
    "answer": "Chỗ rẽ, ngã rẽ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈtɜːrnɪŋ /",
    "status": "new"
  },
  {
    "id": "oxford-765",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Fork",
    "answer": "Ngã ba",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / fɔːrk /",
    "status": "new"
  },
  {
    "id": "oxford-766",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Toll",
    "answer": "Lệ phí qua đường, qua cầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / toʊl /",
    "status": "new"
  },
  {
    "id": "oxford-767",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Toll road",
    "answer": "Đường có thu phí",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / toʊl roʊd /",
    "status": "new"
  },
  {
    "id": "oxford-768",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Motorway",
    "answer": "Xa lộ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈmoʊtərweɪ/",
    "status": "new"
  },
  {
    "id": "oxford-769",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Hard shoulder",
    "answer": "Vạt đất cạnh xa lộ để dừng xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / hɑːrd ˈʃoʊldə /",
    "status": "new"
  },
  {
    "id": "oxford-770",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Dual carriageway",
    "answer": "Xa lộ hai chiều",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / duːəl ˈkærɪdʒweɪ /",
    "status": "new"
  },
  {
    "id": "oxford-771",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "One-way street",
    "answer": "Đường một chiều",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / wʌn weɪ striːt /",
    "status": "new"
  },
  {
    "id": "oxford-772",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "T-junction",
    "answer": "Ngã ba",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / tiːˈdʒʌŋkʃn /",
    "status": "new"
  },
  {
    "id": "oxford-773",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Roundabout",
    "answer": "Bùng binh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈraʊndəbaʊt /",
    "status": "new"
  },
  {
    "id": "oxford-774",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Accident",
    "answer": "Tai nạn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈæksɪdənt /",
    "status": "new"
  },
  {
    "id": "oxford-775",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Breathalyser",
    "answer": "Thiết bị kiểm tra độ cồn trong hơi thở",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈbreθəlaɪzər /",
    "status": "new"
  },
  {
    "id": "oxford-776",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Traffic warden",
    "answer": "Nhân viên kiểm soát đỗ xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈtræfɪk ˈwɔːrdn /",
    "status": "new"
  },
  {
    "id": "oxford-777",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Parking-meter",
    "answer": "Đồng hồ đỗ xe",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈpɑːrkɪŋ ˈmiːtər/",
    "status": "new"
  },
  {
    "id": "oxford-778",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Car park",
    "answer": "Bãi đỗ xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / kɑːr pɑːrk /",
    "status": "new"
  },
  {
    "id": "oxford-779",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Parking space",
    "answer": "Chỗ đỗ xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈpɑːrkɪŋ speɪs /",
    "status": "new"
  },
  {
    "id": "oxford-780",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Multi-storey car park",
    "answer": "Bãi đỗ xe nhiều tầng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈmʌlti ˈstɔːri kɑːr pɑːrk/",
    "status": "new"
  },
  {
    "id": "oxford-781",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Parking ticket",
    "answer": "Vé đỗ xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈpɑːrkɪŋ ˈtɪkɪt /",
    "status": "new"
  },
  {
    "id": "oxford-782",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Driving licence",
    "answer": "Bằng lái xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈdraɪvɪŋ ˈlaɪsns /",
    "status": "new"
  },
  {
    "id": "oxford-783",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Reverse gear",
    "answer": "Số lùi (xe máy)",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / rɪˈvɜːrs ɡɪr /",
    "status": "new"
  },
  {
    "id": "oxford-784",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Learner driver",
    "answer": "Người học lái xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈlɜːrnər ˈdraɪvər /",
    "status": "new"
  },
  {
    "id": "oxford-785",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Passenger",
    "answer": "Hành khách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈpæsɪndʒər /",
    "status": "new"
  },
  {
    "id": "oxford-786",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Stall",
    "answer": "Làm chết máy",
    "example": "Từ loại: Động từ (v) | Phiên âm: / stɔːl /",
    "status": "new"
  },
  {
    "id": "oxford-787",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Tyre pressure",
    "answer": "Áp suất lốp xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtaɪər ˈpreʃər /",
    "status": "new"
  },
  {
    "id": "oxford-788",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Traffic light",
    "answer": "Đèn giao thông",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtræfɪk laɪt /",
    "status": "new"
  },
  {
    "id": "oxford-789",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Speed limit",
    "answer": "Giới hạn tốc độ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / spiːd ˈlɪmɪt /",
    "status": "new"
  },
  {
    "id": "oxford-790",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Speeding fine",
    "answer": "Phạt tốc độ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈspiːdɪŋ faɪn /",
    "status": "new"
  },
  {
    "id": "oxford-791",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Level crossing",
    "answer": "Chỗ chắn tàu",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈlevl ˈkrɔːsɪŋ /",
    "status": "new"
  },
  {
    "id": "oxford-792",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Jump leads",
    "answer": "Dây sạc điện",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / dʒʌmp liːdz /",
    "status": "new"
  },
  {
    "id": "oxford-793",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Oil",
    "answer": "Dầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ɔɪl /",
    "status": "new"
  },
  {
    "id": "oxford-794",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Diesel",
    "answer": "Dầu diesel",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈdiːzl /",
    "status": "new"
  },
  {
    "id": "oxford-795",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Petrol",
    "answer": "Xăng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈpetrəl /",
    "status": "new"
  },
  {
    "id": "oxford-796",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Unleaded",
    "answer": "Không chì",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: / ˌʌnˈledɪd /",
    "status": "new"
  },
  {
    "id": "oxford-797",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Petrol pump",
    "answer": "Bơm xăng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / ˈpetrəl pʌmp /",
    "status": "new"
  },
  {
    "id": "oxford-798",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Driver",
    "answer": "Tài xế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈdraɪvər /",
    "status": "new"
  },
  {
    "id": "oxford-799",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Drive",
    "answer": "Lái xe",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / draɪv /",
    "status": "new"
  },
  {
    "id": "oxford-800",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Change gear",
    "answer": "Chuyển số",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / tʃeɪndʒ ɡɪr /",
    "status": "new"
  },
  {
    "id": "oxford-801",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Jack",
    "answer": "Đòn bẩy, palăng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / dʒæk /",
    "status": "new"
  },
  {
    "id": "oxford-802",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Flat tyre",
    "answer": "Lốp xì hơi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: / flæt ˈtaɪər /",
    "status": "new"
  },
  {
    "id": "oxford-803",
    "category": "english",
    "subCategory": "Giao thông",
    "question": "Puncture",
    "answer": "Sự thủng xăm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: / ˈpʌŋktʃər/",
    "status": "new"
  },
  {
    "id": "oxford-804",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Angry",
    "answer": "Tức giận",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈæŋɡri/",
    "status": "new"
  },
  {
    "id": "oxford-805",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Sleepy",
    "answer": "Buồn ngủ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsliːpi/",
    "status": "new"
  },
  {
    "id": "oxford-806",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Surprised",
    "answer": "Ngạc nhiên, bất ngờ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /səˈpraɪzd/ - /sərˈpraɪzd/",
    "status": "new"
  },
  {
    "id": "oxford-807",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Grateful",
    "answer": "Biết ơn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈɡreɪtfl/",
    "status": "new"
  },
  {
    "id": "oxford-808",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Scared",
    "answer": "Sợ hãi",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /skeəd/ - /skerd/",
    "status": "new"
  },
  {
    "id": "oxford-809",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Embarrassed",
    "answer": "Bối rối, xấu hổ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ɪmˈbærəst/",
    "status": "new"
  },
  {
    "id": "oxford-810",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Confused",
    "answer": "Lúng túng, bối rối",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /kənˈfjuːzd/",
    "status": "new"
  },
  {
    "id": "oxford-811",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Sad",
    "answer": "Buồn rầu",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /sæd/",
    "status": "new"
  },
  {
    "id": "oxford-812",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Hungry",
    "answer": "Đói bụng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈhʌŋɡri/",
    "status": "new"
  },
  {
    "id": "oxford-813",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Full",
    "answer": "No",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /fʊl/",
    "status": "new"
  },
  {
    "id": "oxford-814",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Happy",
    "answer": "Vui, hạnh phúc",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈhæpi/",
    "status": "new"
  },
  {
    "id": "oxford-815",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Jealous",
    "answer": "Ghen, ghen tuông",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈdʒeləs/",
    "status": "new"
  },
  {
    "id": "oxford-816",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Nervous",
    "answer": "Bồn chồn, lo lắng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈnɜːvəs/ - /ˈnɜːrvəs/",
    "status": "new"
  },
  {
    "id": "oxford-817",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Thirsty",
    "answer": "Khát nước",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈθɜːsti/ - /ˈθɜːrsti/",
    "status": "new"
  },
  {
    "id": "oxford-818",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Comfortable",
    "answer": "Thoải mái",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈkʌmftəbl/ - /ˈkʌmfətəbl/",
    "status": "new"
  },
  {
    "id": "oxford-819",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Tense",
    "answer": "Căng thẳng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /tens/",
    "status": "new"
  },
  {
    "id": "oxford-820",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Tired",
    "answer": "Mệt mỏi",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈtaɪəd/ - /ˈtaɪərd/",
    "status": "new"
  },
  {
    "id": "oxford-821",
    "category": "english",
    "subCategory": "Cảm xúc, cảm giác",
    "question": "Bored",
    "answer": "Chán nản",
    "example": "Từ loại: Động từ (v) | Phiên âm: /bɔːd/ - /bɔːrd/",
    "status": "new"
  },
  {
    "id": "oxford-822",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Reliable",
    "answer": "Đáng tin cậy",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /rɪˈlaɪəbəl/",
    "status": "new"
  },
  {
    "id": "oxford-823",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Rude",
    "answer": "Thô lỗ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ruːd/",
    "status": "new"
  },
  {
    "id": "oxford-824",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Selfish",
    "answer": "Ích kỷ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsɛlfɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-825",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Sensitive",
    "answer": "Nhạy cảm",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsɛnsɪtɪv/",
    "status": "new"
  },
  {
    "id": "oxford-826",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Stubborn",
    "answer": "Bướng bỉnh",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈstʌb.ərn/",
    "status": "new"
  },
  {
    "id": "oxford-827",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Patient",
    "answer": "Kiên nhẫn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈpeɪʃənt/",
    "status": "new"
  },
  {
    "id": "oxford-828",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Humorous",
    "answer": "Hài hước",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈhjuː.mər.əs/",
    "status": "new"
  },
  {
    "id": "oxford-829",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Sincere",
    "answer": "Chân thành",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /sɪnˈsɪr/",
    "status": "new"
  },
  {
    "id": "oxford-830",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Generous",
    "answer": "Hào phóng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈʤɛnərəs/",
    "status": "new"
  },
  {
    "id": "oxford-831",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Honest",
    "answer": "Trung thực",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈɒn.ɪst/",
    "status": "new"
  },
  {
    "id": "oxford-832",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Kind",
    "answer": "Tử tế, tốt bụng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /kaɪnd/",
    "status": "new"
  },
  {
    "id": "oxford-833",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Loyal",
    "answer": "Trung thành",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /lɔɪəl/",
    "status": "new"
  },
  {
    "id": "oxford-834",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Modest",
    "answer": "Khiêm tốn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈmɒd.ɪst/",
    "status": "new"
  },
  {
    "id": "oxford-835",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Nasty",
    "answer": "Khó chịu",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈnæsti/",
    "status": "new"
  },
  {
    "id": "oxford-836",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Shy",
    "answer": "Nhút nhát",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ʃaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-837",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Sociable",
    "answer": "Hòa đồng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsoʊʃəbəl/",
    "status": "new"
  },
  {
    "id": "oxford-838",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Reserved",
    "answer": "Rụt rè, dè dặt",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈθɔːt.fəl/",
    "status": "new"
  },
  {
    "id": "oxford-839",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Confident",
    "answer": "Tự tin",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈkɑnfədənt/",
    "status": "new"
  },
  {
    "id": "oxford-840",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Pleasant",
    "answer": "Lịch sự, hòa nhã",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈplɛzənt/",
    "status": "new"
  },
  {
    "id": "oxford-841",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Clever",
    "answer": "Thông minh",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈklɛvər/",
    "status": "new"
  },
  {
    "id": "oxford-842",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Thoughtful",
    "answer": "Ân cần, chu đáo",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈθɔːt.fəl/",
    "status": "new"
  },
  {
    "id": "oxford-843",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Proud",
    "answer": "Tự trọng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /praʊd/",
    "status": "new"
  },
  {
    "id": "oxford-844",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Lazy",
    "answer": "Lười biếng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈleɪzi/",
    "status": "new"
  },
  {
    "id": "oxford-845",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Crazy",
    "answer": "Ngu ngốc",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈkreɪzi/",
    "status": "new"
  },
  {
    "id": "oxford-846",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Silly",
    "answer": "Ngốc nghếch",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsɪli/",
    "status": "new"
  },
  {
    "id": "oxford-847",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Bossy",
    "answer": "Hống hách",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈbɒs.i/",
    "status": "new"
  },
  {
    "id": "oxford-848",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Gossip",
    "answer": "Người mách lẻo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡɒs.ɪp/",
    "status": "new"
  },
  {
    "id": "oxford-849",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Extrovert",
    "answer": "Người hướng ngoại",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɛk.strə.vɜːt/",
    "status": "new"
  },
  {
    "id": "oxford-850",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Coward",
    "answer": "Người nhát gan",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kaʊərd/",
    "status": "new"
  },
  {
    "id": "oxford-851",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Big-head",
    "answer": "Người tự cao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɪɡ hɛd/",
    "status": "new"
  },
  {
    "id": "oxford-852",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Snob",
    "answer": "Người hợm hĩnh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /snɒb/",
    "status": "new"
  },
  {
    "id": "oxford-853",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Liar",
    "answer": "Người nói dối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /laɪər/",
    "status": "new"
  },
  {
    "id": "oxford-854",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Ambitious",
    "answer": "Tham vọng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /æmˈbɪʃəs/",
    "status": "new"
  },
  {
    "id": "oxford-855",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Introvert",
    "answer": "Người hướng nội",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɪn.trə.vɜːt/",
    "status": "new"
  },
  {
    "id": "oxford-856",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Stingy",
    "answer": "Keo kiệt",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈstɪnʤi/",
    "status": "new"
  },
  {
    "id": "oxford-857",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Arrogant",
    "answer": "Kiêu căng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈær.ə.ɡənt/",
    "status": "new"
  },
  {
    "id": "oxford-858",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Vain",
    "answer": "Tự phụ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /veɪn/",
    "status": "new"
  },
  {
    "id": "oxford-859",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Absent-minded",
    "answer": "Đãng trí",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌæb.sənt ˈmaɪn.dɪd/",
    "status": "new"
  },
  {
    "id": "oxford-860",
    "category": "english",
    "subCategory": "Tính cách",
    "question": "Hostile",
    "answer": "Thù địch",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈhɒs.təl/",
    "status": "new"
  },
  {
    "id": "oxford-861",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Juice",
    "answer": "Nước ép",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʒuːs/",
    "status": "new"
  },
  {
    "id": "oxford-862",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Lemonade",
    "answer": "Nước chanh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌlɛm.əˈneɪd/",
    "status": "new"
  },
  {
    "id": "oxford-863",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Beer",
    "answer": "Bia",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɪr/",
    "status": "new"
  },
  {
    "id": "oxford-864",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Soda",
    "answer": "Sô-đa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsoʊdə/",
    "status": "new"
  },
  {
    "id": "oxford-865",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Cider",
    "answer": "Rượu táo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsaɪdər/",
    "status": "new"
  },
  {
    "id": "oxford-866",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Rum",
    "answer": "Rượu rum",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rʌm/",
    "status": "new"
  },
  {
    "id": "oxford-867",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Ginger ale",
    "answer": "Nước gừng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈʤɪnʤər eɪl/",
    "status": "new"
  },
  {
    "id": "oxford-868",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Champagne",
    "answer": "Rượu sâm panh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃæmˈpeɪn/",
    "status": "new"
  },
  {
    "id": "oxford-869",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Bitter",
    "answer": "Đắng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈbɪtər/",
    "status": "new"
  },
  {
    "id": "oxford-870",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Malt",
    "answer": "Mạch nha",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɔːlt/",
    "status": "new"
  },
  {
    "id": "oxford-871",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Barley",
    "answer": "Lúa mạch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɑːr.li/",
    "status": "new"
  },
  {
    "id": "oxford-872",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Distillery",
    "answer": "Nhà máy rượu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈstɪləri/",
    "status": "new"
  },
  {
    "id": "oxford-873",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Coffee",
    "answer": "Cà phê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɔː.fi/",
    "status": "new"
  },
  {
    "id": "oxford-874",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Milk",
    "answer": "Sữa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɪlk/",
    "status": "new"
  },
  {
    "id": "oxford-875",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Tea",
    "answer": "Trà",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tiː/",
    "status": "new"
  },
  {
    "id": "oxford-876",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Red wine",
    "answer": "Rượu vang đỏ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /rɛd waɪn/",
    "status": "new"
  },
  {
    "id": "oxford-877",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Non-alcoholic",
    "answer": "Không cồn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌnɑːn ˌæl.kəˈhɒl.ɪk/",
    "status": "new"
  },
  {
    "id": "oxford-878",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Full-cream",
    "answer": "Nguyên kem",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌfʊl ˈkriːm/",
    "status": "new"
  },
  {
    "id": "oxford-879",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Herbal",
    "answer": "(chứa) thảo mộc",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈhɜːr.bəl/",
    "status": "new"
  },
  {
    "id": "oxford-880",
    "category": "english",
    "subCategory": "Đồ uống",
    "question": "Mineral water",
    "answer": "Nước khoáng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmɪn.ər.əl ˈwɔː.tər/",
    "status": "new"
  },
  {
    "id": "oxford-881",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Lotus",
    "answer": "Hoa sen",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈloʊtəs/",
    "status": "new"
  },
  {
    "id": "oxford-882",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Lily",
    "answer": "Hoa loa kèn",
    "example": "Từ loại: Trạng từ (adv) | Phiên âm: /ˈlɪli/",
    "status": "new"
  },
  {
    "id": "oxford-883",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Poppy",
    "answer": "Hoa anh túc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɒp.i/",
    "status": "new"
  },
  {
    "id": "oxford-884",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Bougainvillea",
    "answer": "Hoa giấy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌbuː.ɡənˈvɪl.i.ə/",
    "status": "new"
  },
  {
    "id": "oxford-885",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Gerbera flower",
    "answer": "Hoa đồng tiền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡɜːr.bər.ə ˈflaʊ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-886",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Tuberose",
    "answer": "Hoa huệ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtuː.bəˌroʊz/",
    "status": "new"
  },
  {
    "id": "oxford-887",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Apricot blossom",
    "answer": "Hoa mai",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈeɪ.prɪ.kɒt ˈblɒs.əm/",
    "status": "new"
  },
  {
    "id": "oxford-888",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Dahlia",
    "answer": "Hoa thược dược",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdeɪ.li.ə/",
    "status": "new"
  },
  {
    "id": "oxford-889",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Jasmine",
    "answer": "Hoa lài",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʤæzmɪn/",
    "status": "new"
  },
  {
    "id": "oxford-890",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Sunflower",
    "answer": "Hoa hướng dương",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsʌnˌflaʊ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-891",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Marigold",
    "answer": "Hoa cúc vạn thọ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmær.ɪˌɡoʊld/",
    "status": "new"
  },
  {
    "id": "oxford-892",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Orchid",
    "answer": "Hoa lan",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɔːr.kɪd/",
    "status": "new"
  },
  {
    "id": "oxford-893",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Rose",
    "answer": "Hoa hồng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /roʊz/",
    "status": "new"
  },
  {
    "id": "oxford-894",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Carnation",
    "answer": "Hoa cẩm chướng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɑːrˈneɪ.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-895",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Cherry blossom",
    "answer": "Hoa anh đào",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈtʃɛr.i ˈblɒs.əm/",
    "status": "new"
  },
  {
    "id": "oxford-896",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Poinsettia",
    "answer": "Hoa trạng nguyên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌpɔɪnˈsɛˌtiə/",
    "status": "new"
  },
  {
    "id": "oxford-897",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Flamboyant",
    "answer": "Hoa phượng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /flæmˈbɔɪənt/",
    "status": "new"
  },
  {
    "id": "oxford-898",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Hibiscus",
    "answer": "Hoa dâm bụt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɪˈbɪs.kəs/",
    "status": "new"
  },
  {
    "id": "oxford-899",
    "category": "english",
    "subCategory": "Các loài hoa",
    "question": "Peach blossom",
    "answer": "Hoa đào",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /piːtʃ ˈblɒs.əm/",
    "status": "new"
  },
  {
    "id": "oxford-900",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Movie",
    "answer": "Phim",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmuː.vi/",
    "status": "new"
  },
  {
    "id": "oxford-901",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Famous",
    "answer": "Nổi tiếng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈfeɪməs/",
    "status": "new"
  },
  {
    "id": "oxford-902",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Comedy",
    "answer": "Hài kịch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɑmədi/",
    "status": "new"
  },
  {
    "id": "oxford-903",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Audience",
    "answer": "Khán giả",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɔː.di.əns/",
    "status": "new"
  },
  {
    "id": "oxford-904",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Film Festival",
    "answer": "Liên hoan phim",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /fɪlm ˈfɛstɪvəl/",
    "status": "new"
  },
  {
    "id": "oxford-905",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Trailer",
    "answer": "Đoạn phim quảng cáo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtreɪlər/",
    "status": "new"
  },
  {
    "id": "oxford-906",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Movie star",
    "answer": "Ngôi sao điện ảnh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmuː.vi stɑːr/",
    "status": "new"
  },
  {
    "id": "oxford-907",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Soundtrack",
    "answer": "Nhạc phim",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsaʊnˌtræk/",
    "status": "new"
  },
  {
    "id": "oxford-908",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Cartoon",
    "answer": "Phim hoạt hình",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɑːrˈtuːn/",
    "status": "new"
  },
  {
    "id": "oxford-909",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Drama",
    "answer": "Vở kịch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdrɑː.mə/",
    "status": "new"
  },
  {
    "id": "oxford-910",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Action film",
    "answer": "Phim hành động",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈækʃən fɪlm/",
    "status": "new"
  },
  {
    "id": "oxford-911",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Celebrity",
    "answer": "Người nổi tiếng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /səˈlɛbrɪti/",
    "status": "new"
  },
  {
    "id": "oxford-912",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Script",
    "answer": "Kịch bản",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skrɪpt/",
    "status": "new"
  },
  {
    "id": "oxford-913",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Theater",
    "answer": "Nhà hát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈθiː.ə.tər/",
    "status": "new"
  },
  {
    "id": "oxford-914",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Actor",
    "answer": "Nam diễn viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæktər/",
    "status": "new"
  },
  {
    "id": "oxford-915",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Actress",
    "answer": "Nữ diễn viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæk.trɪs/",
    "status": "new"
  },
  {
    "id": "oxford-916",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Director",
    "answer": "Đạo diễn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈrɛktər/",
    "status": "new"
  },
  {
    "id": "oxford-917",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Romantic",
    "answer": "Lãng mạn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /roʊˈmæntɪk/",
    "status": "new"
  },
  {
    "id": "oxford-918",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Silent film",
    "answer": "Phim câm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsaɪlənt fɪlm/",
    "status": "new"
  },
  {
    "id": "oxford-919",
    "category": "english",
    "subCategory": "Phim ảnh",
    "question": "Movie ticket",
    "answer": "Vé xem phim",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmuː.vi ˈtɪk.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-920",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Stadium",
    "answer": "Sân vận động",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsteɪdiəm/",
    "status": "new"
  },
  {
    "id": "oxford-921",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Stand",
    "answer": "Khán đài",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /stænd/",
    "status": "new"
  },
  {
    "id": "oxford-922",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Pitch",
    "answer": "Sân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɪʧ/",
    "status": "new"
  },
  {
    "id": "oxford-923",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Touchline",
    "answer": "Đường biên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʌtʃ.laɪn/",
    "status": "new"
  },
  {
    "id": "oxford-924",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Penalty area",
    "answer": "Khu phạt đền",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpɛnəlti ˈɛriə/",
    "status": "new"
  },
  {
    "id": "oxford-925",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Goal",
    "answer": "Khung thành",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /goʊl/",
    "status": "new"
  },
  {
    "id": "oxford-926",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Penalty",
    "answer": "Phạt đền",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɛnəlti/",
    "status": "new"
  },
  {
    "id": "oxford-927",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Corner kick",
    "answer": "Cú đá phạt góc",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɔːr.nər kɪk/",
    "status": "new"
  },
  {
    "id": "oxford-928",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Free kick",
    "answer": "Đá phạt trực tiếp",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌfriː ˈkɪk/",
    "status": "new"
  },
  {
    "id": "oxford-929",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Indirect free kick",
    "answer": "Đá phạt gián tiếp",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌɪn.daɪˈrɛkt ˌfriː ˈkɪk/",
    "status": "new"
  },
  {
    "id": "oxford-930",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Kick off",
    "answer": "Bắt đầu, lăn bóng",
    "example": "Từ loại: phrasal v | Phiên âm: /ˈkɪk .ɔːf/",
    "status": "new"
  },
  {
    "id": "oxford-931",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Offside",
    "answer": "Việt vị",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌɒfˈsaɪd/",
    "status": "new"
  },
  {
    "id": "oxford-932",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Corner flag",
    "answer": "Cờ cắm tại góc sân bóng đá",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkɔːr.nər flæɡ/",
    "status": "new"
  },
  {
    "id": "oxford-933",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Bet",
    "answer": "Cá độ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /bɛt/",
    "status": "new"
  },
  {
    "id": "oxford-934",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "The bench",
    "answer": "Băng ghế dự bị",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ðə bɛnʧ/",
    "status": "new"
  },
  {
    "id": "oxford-935",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Foul",
    "answer": "Lỗi, pha phạm lỗi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /faʊl/",
    "status": "new"
  },
  {
    "id": "oxford-936",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Goal line",
    "answer": "Vạch kẻ (khung thành)",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɡoʊl laɪn/",
    "status": "new"
  },
  {
    "id": "oxford-937",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Shoot",
    "answer": "Ném, sút",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ʃuːt/",
    "status": "new"
  },
  {
    "id": "oxford-938",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Goalkeeper",
    "answer": "Thủ môn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡoʊlˌkiː.pər/",
    "status": "new"
  },
  {
    "id": "oxford-939",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Defender",
    "answer": "Hậu vệ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈfɛn.dər/",
    "status": "new"
  },
  {
    "id": "oxford-940",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Centre back",
    "answer": "Trung vệ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsɛn.tər bæk/",
    "status": "new"
  },
  {
    "id": "oxford-941",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Midfielder",
    "answer": "Trung vệ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɪdˌfiːl.dər/",
    "status": "new"
  },
  {
    "id": "oxford-942",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Attacking midfielder",
    "answer": "Tiền vệ tấn công",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /əˈtæk.ɪŋ ˈmɪdˌfiːl.dər/",
    "status": "new"
  },
  {
    "id": "oxford-943",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Winger",
    "answer": "Cầu thủ chạy biên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɪŋ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-944",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Referee",
    "answer": "Trọng tài",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌrɛf.əˈriː/",
    "status": "new"
  },
  {
    "id": "oxford-945",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Commentator",
    "answer": "Bình luận viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒm.ənˌteɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-946",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Supporter",
    "answer": "Cổ động viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /səˈpɔːr.tər/",
    "status": "new"
  },
  {
    "id": "oxford-947",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Linesman",
    "answer": "Trọng tài biên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪnz.mən/",
    "status": "new"
  },
  {
    "id": "oxford-948",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Hooligan",
    "answer": "Kẻ côn đồ, quá khích",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhuː.lɪ.ɡən/",
    "status": "new"
  },
  {
    "id": "oxford-949",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Red card",
    "answer": "Thẻ đỏ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈrɛd kɑːrd/",
    "status": "new"
  },
  {
    "id": "oxford-950",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Yellow card",
    "answer": "Thẻ vàng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈjɛl.oʊ kɑːrd/",
    "status": "new"
  },
  {
    "id": "oxford-951",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Coach",
    "answer": "Huấn luyện viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /koʊtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-952",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Reserve team",
    "answer": "Đội dự bị",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /rɪˈzɜːrv tiːm/",
    "status": "new"
  },
  {
    "id": "oxford-953",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Caution",
    "answer": "Lời cảnh cáo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɔː.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-954",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Stimulant",
    "answer": "Chất kích thích",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstɪm.jʊ.lənt/",
    "status": "new"
  },
  {
    "id": "oxford-955",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Strategy",
    "answer": "Chiến lược",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstræt.ə.dʒi/",
    "status": "new"
  },
  {
    "id": "oxford-956",
    "category": "english",
    "subCategory": "Bóng đá",
    "question": "Striker",
    "answer": "Tiền đạo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstraɪ.kər/",
    "status": "new"
  },
  {
    "id": "oxford-957",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Winter",
    "answer": "Mùa đông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɪn.tər/",
    "status": "new"
  },
  {
    "id": "oxford-958",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Candle",
    "answer": "Nến",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæn.dəl/",
    "status": "new"
  },
  {
    "id": "oxford-959",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Snow",
    "answer": "Tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /snoʊ/",
    "status": "new"
  },
  {
    "id": "oxford-960",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Sack",
    "answer": "Bao, túi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sæk/",
    "status": "new"
  },
  {
    "id": "oxford-961",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Card",
    "answer": "Tấm thiệp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɑːrd/",
    "status": "new"
  },
  {
    "id": "oxford-962",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Fireplace",
    "answer": "Lò sưởi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfaɪərˌpleɪs/",
    "status": "new"
  },
  {
    "id": "oxford-963",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Chimney",
    "answer": "Ống khói",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɪm.ni/",
    "status": "new"
  },
  {
    "id": "oxford-964",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Gift",
    "answer": "Quà tặng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡɪft/",
    "status": "new"
  },
  {
    "id": "oxford-965",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Christmas",
    "answer": "Lễ Giáng Sinh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkrɪs.məs/",
    "status": "new"
  },
  {
    "id": "oxford-966",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Ornament",
    "answer": "Đồ trang trí",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɔːr.nə.mənt/",
    "status": "new"
  },
  {
    "id": "oxford-967",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Pine tree",
    "answer": "Cây thông",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /paɪn triː/",
    "status": "new"
  },
  {
    "id": "oxford-968",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Sled",
    "answer": "Xe trượt tuyết",
    "example": "Từ loại: Động từ (v) | Phiên âm: /slɛd/",
    "status": "new"
  },
  {
    "id": "oxford-969",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Bell",
    "answer": "Chuông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɛl/",
    "status": "new"
  },
  {
    "id": "oxford-970",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Snowflake",
    "answer": "Bông tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsnoʊˌfleɪk/",
    "status": "new"
  },
  {
    "id": "oxford-971",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Wreath",
    "answer": "Vòng hoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /riːθ/",
    "status": "new"
  },
  {
    "id": "oxford-972",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Scarf",
    "answer": "Khăn choàng cổ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skɑːrf/",
    "status": "new"
  },
  {
    "id": "oxford-973",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Christmas tree",
    "answer": "Cây thông Giáng Sinh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkrɪs.məs triː/",
    "status": "new"
  },
  {
    "id": "oxford-974",
    "category": "english",
    "subCategory": "Giáng sinh",
    "question": "Christmas card",
    "answer": "Thiệp Giáng sinh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkrɪs.məs kɑːrd/",
    "status": "new"
  },
  {
    "id": "oxford-975",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Beef",
    "answer": "Thịt bò",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /biːf/",
    "status": "new"
  },
  {
    "id": "oxford-976",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Pork",
    "answer": "Thịt heo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɔːrk/",
    "status": "new"
  },
  {
    "id": "oxford-977",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Bacon",
    "answer": "Thịt ba rọi xông khói",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbeɪ.kən/",
    "status": "new"
  },
  {
    "id": "oxford-978",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Ham",
    "answer": "Thịt đùi, thịt xông khói",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hæm/",
    "status": "new"
  },
  {
    "id": "oxford-979",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Yoghurt",
    "answer": "Sữa chua",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈjoʊ.ɡərt/",
    "status": "new"
  },
  {
    "id": "oxford-980",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Pie",
    "answer": "Bánh nướng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /paɪ/",
    "status": "new"
  },
  {
    "id": "oxford-981",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Bread",
    "answer": "Bánh mì",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /brɛd/",
    "status": "new"
  },
  {
    "id": "oxford-982",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Cake",
    "answer": "Bánh ngọt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /keɪk/",
    "status": "new"
  },
  {
    "id": "oxford-983",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Chip",
    "answer": "Khoai tây chiên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɪp/",
    "status": "new"
  },
  {
    "id": "oxford-984",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Biscuit",
    "answer": "Bánh quy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɪs.kɪt/",
    "status": "new"
  },
  {
    "id": "oxford-985",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Noodle",
    "answer": "Mì, bún",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnuː.dəl/",
    "status": "new"
  },
  {
    "id": "oxford-986",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Butter",
    "answer": "Bơ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʌt.ər/",
    "status": "new"
  },
  {
    "id": "oxford-987",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Olive",
    "answer": "Quả ô liu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɒl.ɪv/",
    "status": "new"
  },
  {
    "id": "oxford-988",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Soy",
    "answer": "Đậu nành",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sɔɪ/",
    "status": "new"
  },
  {
    "id": "oxford-989",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Flour",
    "answer": "Bột",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈflaʊər/",
    "status": "new"
  },
  {
    "id": "oxford-990",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Lunch",
    "answer": "Bữa ăn trưa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /lʌntʃ/",
    "status": "new"
  },
  {
    "id": "oxford-991",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Mint",
    "answer": "Bạc hà",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɪnt/",
    "status": "new"
  },
  {
    "id": "oxford-992",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Vanilla",
    "answer": "Vani",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /vəˈnɪl.ə/",
    "status": "new"
  },
  {
    "id": "oxford-993",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Candy",
    "answer": "Kẹo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæn.di/",
    "status": "new"
  },
  {
    "id": "oxford-994",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Popcorn",
    "answer": "Bỏng ngô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɒp.kɔːrn/",
    "status": "new"
  },
  {
    "id": "oxford-995",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Snack",
    "answer": "Bữa ăn nhẹ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /snæk/",
    "status": "new"
  },
  {
    "id": "oxford-996",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Barbecue",
    "answer": "Tiệc nướng ngoài trời",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɑːr.bɪ.kjuː/",
    "status": "new"
  },
  {
    "id": "oxford-997",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Fast food",
    "answer": "Thức ăn nhanh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌfæst ˈfuːd/",
    "status": "new"
  },
  {
    "id": "oxford-998",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Junk food",
    "answer": "Đồ ăn vặt",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈdʒʌŋk ˌfuːd/",
    "status": "new"
  },
  {
    "id": "oxford-999",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Frozen food",
    "answer": "Thực phẩm đông lạnh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfroʊ.zən ˌfuːd/",
    "status": "new"
  },
  {
    "id": "oxford-1000",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Health food",
    "answer": "Thực phẩm tự nhiên",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈhɛlθ ˌfuːd/",
    "status": "new"
  },
  {
    "id": "oxford-1001",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Distinctive",
    "answer": "Đặc trưng, khác biệt",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /dɪˈstɪŋk.tɪv/",
    "status": "new"
  },
  {
    "id": "oxford-1002",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Flavor",
    "answer": "Hương vị",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfleɪ.vər/",
    "status": "new"
  },
  {
    "id": "oxford-1003",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Balanced diet",
    "answer": "Chế độ ăn uống cân bằng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbæl.ənst ˈdaɪ.ət/",
    "status": "new"
  },
  {
    "id": "oxford-1004",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Stale",
    "answer": "Ôi, thiu",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /steɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1005",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Sour",
    "answer": "Chua",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsaʊ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1006",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Burnt",
    "answer": "Cháy, khét",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /bɜːrnt/",
    "status": "new"
  },
  {
    "id": "oxford-1007",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Overdone",
    "answer": "Quá chín, rục",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌoʊ.vərˈdʌn/",
    "status": "new"
  },
  {
    "id": "oxford-1008",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Underdone",
    "answer": "Chưa chín, tái",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌʌn.dərˈdʌn/",
    "status": "new"
  },
  {
    "id": "oxford-1009",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Full",
    "answer": "No",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /fʊl/",
    "status": "new"
  },
  {
    "id": "oxford-1010",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Veal",
    "answer": "Thịt bê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /viːl/",
    "status": "new"
  },
  {
    "id": "oxford-1011",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Cereal",
    "answer": "Ngũ cốc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɪər.i.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1012",
    "category": "english",
    "subCategory": "Đồ ăn",
    "question": "Hot dog",
    "answer": "Bánh mì kẹp xúc xích",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈhɒt dɒɡ/",
    "status": "new"
  },
  {
    "id": "oxford-1013",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Music",
    "answer": "Âm nhạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmjuː.zɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1014",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Band",
    "answer": "Nhóm nhạc, ban nhạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bænd/",
    "status": "new"
  },
  {
    "id": "oxford-1015",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Play",
    "answer": "Chơi (nhạc cụ)",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pleɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1016",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Note",
    "answer": "Nốt nhạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /noʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1017",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Drum",
    "answer": "Trống",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /drʌm/",
    "status": "new"
  },
  {
    "id": "oxford-1018",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Playlist",
    "answer": "Danh sách bài hát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpleɪ.lɪst/",
    "status": "new"
  },
  {
    "id": "oxford-1019",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Musician",
    "answer": "Nhạc sĩ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mjuˈzɪʃ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1020",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Perform",
    "answer": "Trình diễn, biểu diễn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pərˈfɔːrm/",
    "status": "new"
  },
  {
    "id": "oxford-1021",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Rhythm",
    "answer": "Nhịp điệu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrɪð.əm/",
    "status": "new"
  },
  {
    "id": "oxford-1022",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Dance",
    "answer": "Nhảy, khiêu vũ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /dæns/",
    "status": "new"
  },
  {
    "id": "oxford-1023",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Listen",
    "answer": "Lắng nghe",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈlɪs.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1024",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Volume",
    "answer": "Âm lượng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈvɑːl.juːm/",
    "status": "new"
  },
  {
    "id": "oxford-1025",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Song",
    "answer": "Bài hát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sɔːŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1026",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Sing",
    "answer": "Hát, ca hát",
    "example": "Từ loại: Động từ (v) | Phiên âm: /sɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1027",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Piano",
    "answer": "Đàn piano",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /piˈæn.oʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1028",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Guitar",
    "answer": "Đàn ghi-ta",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡɪˈtɑːr/",
    "status": "new"
  },
  {
    "id": "oxford-1029",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Instrument",
    "answer": "Nhạc cụ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɪn.strə.mənt/",
    "status": "new"
  },
  {
    "id": "oxford-1030",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Harmony",
    "answer": "Hoà âm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɑːr.mə.ni/",
    "status": "new"
  },
  {
    "id": "oxford-1031",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Melody",
    "answer": "Giai điệu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɛl.ə.di/",
    "status": "new"
  },
  {
    "id": "oxford-1032",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "String",
    "answer": "Dây đàn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /strɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1033",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "The brass",
    "answer": "Dàn kèn đồng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ðə bræs/",
    "status": "new"
  },
  {
    "id": "oxford-1034",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Symphony",
    "answer": "Bản giao hưởng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɪm.fə.ni/",
    "status": "new"
  },
  {
    "id": "oxford-1035",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Overture",
    "answer": "Khúc dạo đầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈoʊ.vər.tʃʊr/",
    "status": "new"
  },
  {
    "id": "oxford-1036",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Conductor",
    "answer": "Nhạc trưởng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kənˈdʌk.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1037",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Composer",
    "answer": "Nhà soạn nhạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəmˈpoʊ.zər/",
    "status": "new"
  },
  {
    "id": "oxford-1038",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Voice",
    "answer": "Giọng nói, giọng hát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /vɔɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1039",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Solo",
    "answer": "Bài đơn ca",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsoʊ.loʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1040",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Lead singer",
    "answer": "Ca sĩ hát chính",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /liːd ˈsɪŋ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1041",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Guitarist",
    "answer": "Nghệ sĩ ghi-ta",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡɪˈtɑːr.ɪst/",
    "status": "new"
  },
  {
    "id": "oxford-1042",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Drummer",
    "answer": "Người đánh trống",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdrʌm.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1043",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Lyrics",
    "answer": "Lời bài hát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɪr.ɪks/",
    "status": "new"
  },
  {
    "id": "oxford-1044",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Chorus",
    "answer": "Điệp khúc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɔːr.əs/",
    "status": "new"
  },
  {
    "id": "oxford-1045",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Opera",
    "answer": "Nhạc kịch, ô-pê-ra",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɑː.pə.rə/",
    "status": "new"
  },
  {
    "id": "oxford-1046",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Folk music",
    "answer": "Nhạc dân gian",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfoʊk ˌmjuː.zɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1047",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Album",
    "answer": "Tuyển tập ca khúc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæl.bəm/",
    "status": "new"
  },
  {
    "id": "oxford-1048",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Tune",
    "answer": "Giai điệu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tjuːn/",
    "status": "new"
  },
  {
    "id": "oxford-1049",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Violin",
    "answer": "Đàn vi-ô-lông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌvaɪəˈlɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1050",
    "category": "english",
    "subCategory": "Âm nhạc",
    "question": "Classical music",
    "answer": "Nhạc cổ điển",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈklæs.ɪ.kəl ˌmjuː.zɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1051",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Date",
    "answer": "Buổi hẹn hò",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /deɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1052",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Engagement",
    "answer": "Đính hôn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪnˈɡeɪdʒ.mənt/",
    "status": "new"
  },
  {
    "id": "oxford-1053",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Ring",
    "answer": "Nhẫn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1054",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Romantic",
    "answer": "Lãng mạn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /roʊˈmæn.tɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1055",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Sweet",
    "answer": "Ngọt ngào",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /swiːt/",
    "status": "new"
  },
  {
    "id": "oxford-1056",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Alone",
    "answer": "Một mình",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /əˈloʊn/",
    "status": "new"
  },
  {
    "id": "oxford-1057",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Couple",
    "answer": "Cặp đôi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌp.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1058",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Forever",
    "answer": "Mãi mãi",
    "example": "Từ loại: Trạng từ (adv) | Phiên âm: /fɔːrˈɛv.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1059",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Boyfriend",
    "answer": "Bạn trai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɔɪ.frɛnd/",
    "status": "new"
  },
  {
    "id": "oxford-1060",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Girlfriend",
    "answer": "Bạn gái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡɜːl.frɛnd/",
    "status": "new"
  },
  {
    "id": "oxford-1061",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Kiss",
    "answer": "Hôn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /kɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1062",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Heart",
    "answer": "Trái tim",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɑːrt/",
    "status": "new"
  },
  {
    "id": "oxford-1063",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Hug",
    "answer": "Ôm",
    "example": "Từ loại: Động từ (v) | Phiên âm: /hʌɡ/",
    "status": "new"
  },
  {
    "id": "oxford-1064",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Propose",
    "answer": "Cầu hôn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /prəˈpoʊz/",
    "status": "new"
  },
  {
    "id": "oxford-1065",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Chocolate",
    "answer": "Sô-cô-la",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɒk.lɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1066",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Wedding",
    "answer": "Đám cưới",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɛd.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1067",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Anniversary",
    "answer": "Ngày kỷ niệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌæn.ɪˈvɜː.sər.i/",
    "status": "new"
  },
  {
    "id": "oxford-1068",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Darling",
    "answer": "Em yêu, anh yêu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɑːr.lɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1069",
    "category": "english",
    "subCategory": "Tình yêu",
    "question": "Single",
    "answer": "Độc thân",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsɪŋ.ɡəl/",
    "status": "new"
  },
  {
    "id": "oxford-1070",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Restaurant",
    "answer": "Nhà hàng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrɛs.tə.rɒnt/",
    "status": "new"
  },
  {
    "id": "oxford-1071",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Main course",
    "answer": "Món chính",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /meɪn kɔːrs/",
    "status": "new"
  },
  {
    "id": "oxford-1072",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Napkin",
    "answer": "Khăn ăn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnæp.kɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1073",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Wine",
    "answer": "Rượu vang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /waɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1074",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Cutlery",
    "answer": "Dụng cụ ăn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌt.lə.ri/",
    "status": "new"
  },
  {
    "id": "oxford-1075",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Drink",
    "answer": "Đồ uống",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /drɪŋk/",
    "status": "new"
  },
  {
    "id": "oxford-1076",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Combo",
    "answer": "Gói, bộ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒm.boʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1077",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Side dish",
    "answer": "Đồ ăn kèm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /saɪd dɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1078",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Meal",
    "answer": "Bữa ăn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /miːl/",
    "status": "new"
  },
  {
    "id": "oxford-1079",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Order",
    "answer": "Gọi món",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈɔːr.dər/",
    "status": "new"
  },
  {
    "id": "oxford-1080",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Speciality",
    "answer": "Đặc sản",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌspeʃ.iˈæl.ə.ti/",
    "status": "new"
  },
  {
    "id": "oxford-1081",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Dessert",
    "answer": "Món tráng miệng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈzɜːrt/",
    "status": "new"
  },
  {
    "id": "oxford-1082",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Salad",
    "answer": "Rau trộn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsæl.əd/",
    "status": "new"
  },
  {
    "id": "oxford-1083",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Menu",
    "answer": "Thực đơn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɛnjuː/",
    "status": "new"
  },
  {
    "id": "oxford-1084",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Waiter",
    "answer": "Người hầu bàn (nam)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈweɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1085",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Guest",
    "answer": "Khách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡɛst/",
    "status": "new"
  },
  {
    "id": "oxford-1086",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Coupon",
    "answer": "Phiếu giảm giá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkuː.pɒn/",
    "status": "new"
  },
  {
    "id": "oxford-1087",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Neat",
    "answer": "Gọn gàng, ngăn nắp",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /niːt/",
    "status": "new"
  },
  {
    "id": "oxford-1088",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Animated",
    "answer": "Náo nhiệt, sôi nổi",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈæn.ɪˌmeɪ.tɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1089",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Hotel",
    "answer": "Khách sạn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hoʊˈtɛl/",
    "status": "new"
  },
  {
    "id": "oxford-1090",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Hotel receptionist",
    "answer": "Nhân viên lễ tân khách sạn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /hoʊˈtɛl rɪˈsɛp.ʃən.ɪst/",
    "status": "new"
  },
  {
    "id": "oxford-1091",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Housekeeper",
    "answer": "Nhân viên dọn phòng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhaʊsˌkiː.pər/",
    "status": "new"
  },
  {
    "id": "oxford-1092",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Hall",
    "answer": "Hành lang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-1093",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Vacancy",
    "answer": "Phòng trống",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈveɪ.kən.si/",
    "status": "new"
  },
  {
    "id": "oxford-1094",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Lobby",
    "answer": "Hành lang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɒb.i/",
    "status": "new"
  },
  {
    "id": "oxford-1095",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Concierge",
    "answer": "Nhân viên hướng dẫn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɒn.siˈɛrʒ/",
    "status": "new"
  },
  {
    "id": "oxford-1096",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Check-in",
    "answer": "Việc nhận phòng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɛk.ɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1097",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Desk clerk",
    "answer": "Nhân viên lễ tân",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /dɛsk klɜːrk/",
    "status": "new"
  },
  {
    "id": "oxford-1098",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Double bed",
    "answer": "Giường đôi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈdʌb.əl bɛd/",
    "status": "new"
  },
  {
    "id": "oxford-1099",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Single bed",
    "answer": "Giường đơn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsɪŋ.ɡəl bɛd/",
    "status": "new"
  },
  {
    "id": "oxford-1100",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Doorman",
    "answer": "Nhân viên gác cửa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɔːr.mən/",
    "status": "new"
  },
  {
    "id": "oxford-1101",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Reception",
    "answer": "Quầy lễ tân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪˈsɛp.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1102",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Elevator",
    "answer": "Thang máy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɛl.ɪˌveɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1103",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Reservation",
    "answer": "Sự đặt chỗ trước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌrɛz.ərˈveɪ.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1104",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Bellboy",
    "answer": "Người trực tầng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɛl.bɔɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1105",
    "category": "english",
    "subCategory": "Nhà hàng, khách sạn",
    "question": "Check out",
    "answer": "Trả phòng",
    "example": "Từ loại: phrasal v | Phiên âm: /ˈtʃɛk aʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1106",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Nursery school",
    "answer": "Trường mẫu giáo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈnɜː.sər.i skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1107",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Teacher",
    "answer": "Giáo viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtiː.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-1108",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Classmate",
    "answer": "Bạn cùng lớp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈklæs.meɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1109",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Library",
    "answer": "Thư viện",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪ.brər.i/",
    "status": "new"
  },
  {
    "id": "oxford-1110",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Pen",
    "answer": "Bút mực",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɛn/",
    "status": "new"
  },
  {
    "id": "oxford-1111",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Pencil",
    "answer": "Bút chì",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɛn.səl/",
    "status": "new"
  },
  {
    "id": "oxford-1112",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Ruler",
    "answer": "Cây thước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈruː.lər/",
    "status": "new"
  },
  {
    "id": "oxford-1113",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Calculator",
    "answer": "Máy tính cầm tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæl.kjʊ.leɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1114",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Chalk",
    "answer": "Phấn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɔːk/",
    "status": "new"
  },
  {
    "id": "oxford-1115",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Student",
    "answer": "Sinh viên, học sinh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstjuː.dənt/",
    "status": "new"
  },
  {
    "id": "oxford-1116",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Classroom",
    "answer": "Phòng học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈklæs.ruːm/",
    "status": "new"
  },
  {
    "id": "oxford-1117",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Primary school",
    "answer": "Trường tiểu học",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpraɪ.mə.ri skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1118",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Secondary school",
    "answer": "Trường trung học cơ sở",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsɛk.ən.dər.i skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1119",
    "category": "english",
    "subCategory": "Trường học",
    "question": "High school",
    "answer": "Trường trung học phổ thông",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /haɪ skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1120",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Vocational school",
    "answer": "Trường dạy nghề",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /voʊˈkeɪ.ʃən.əl skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1121",
    "category": "english",
    "subCategory": "Trường học",
    "question": "College",
    "answer": "Trường đại học, cao đẳng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒl.ɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-1122",
    "category": "english",
    "subCategory": "Trường học",
    "question": "University",
    "answer": "Trường đại học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌjuː.nɪˈvɜː.sə.ti/",
    "status": "new"
  },
  {
    "id": "oxford-1123",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Principal",
    "answer": "Hiệu trưởng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈprɪn.sɪ.pəl/",
    "status": "new"
  },
  {
    "id": "oxford-1124",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Blackboard",
    "answer": "Bảng đen",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈblæk.bɔːd/",
    "status": "new"
  },
  {
    "id": "oxford-1125",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Compass",
    "answer": "Com-pa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌm.pəs/",
    "status": "new"
  },
  {
    "id": "oxford-1126",
    "category": "english",
    "subCategory": "Trường học",
    "question": "History",
    "answer": "Môn lịch sử",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɪs.tər.i/",
    "status": "new"
  },
  {
    "id": "oxford-1127",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Economics",
    "answer": "Kinh tế học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌiː.kəˈnɒm.ɪks/",
    "status": "new"
  },
  {
    "id": "oxford-1128",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Chemistry",
    "answer": "Hóa học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɛm.ɪ.stri/",
    "status": "new"
  },
  {
    "id": "oxford-1129",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Biology",
    "answer": "Sinh học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /baɪˈɒl.ə.dʒi/",
    "status": "new"
  },
  {
    "id": "oxford-1130",
    "category": "english",
    "subCategory": "Trường học",
    "question": "IT",
    "answer": "Công nghệ thông tin",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /aɪ ˈtiː/",
    "status": "new"
  },
  {
    "id": "oxford-1131",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Geography",
    "answer": "Địa lý",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʒɪˈɒɡ.rə.fi/",
    "status": "new"
  },
  {
    "id": "oxford-1132",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Art",
    "answer": "Mỹ thuật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɑːrt/",
    "status": "new"
  },
  {
    "id": "oxford-1133",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Fail",
    "answer": "Rớt; đánh rớt",
    "example": "Từ loại: Động từ (v) | Phiên âm: /feɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1134",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Pass",
    "answer": "Đậu, đỗ (kỳ thi)",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pɑːs/",
    "status": "new"
  },
  {
    "id": "oxford-1135",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Graduate",
    "answer": "Tốt nghiệp",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈɡrædʒ.u.eɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1136",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Degree",
    "answer": "Bằng cấp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈɡriː/",
    "status": "new"
  },
  {
    "id": "oxford-1137",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Playground",
    "answer": "Sân chơi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpleɪ.ɡraʊnd/",
    "status": "new"
  },
  {
    "id": "oxford-1138",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Uniform",
    "answer": "Đồng phục",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈjuː.nɪ.fɔːm/",
    "status": "new"
  },
  {
    "id": "oxford-1139",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Grade",
    "answer": "Điểm số",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡreɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1140",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Form teacher",
    "answer": "Giáo viên chủ nhiệm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /fɔːm ˈtiː.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-1141",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Proctor",
    "answer": "Giám thị",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈprɒk.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1142",
    "category": "english",
    "subCategory": "Trường học",
    "question": "School bag",
    "answer": "Cặp",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /skuːl bæg/",
    "status": "new"
  },
  {
    "id": "oxford-1143",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Dean",
    "answer": "Trưởng khoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /diːn/",
    "status": "new"
  },
  {
    "id": "oxford-1144",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Lesson",
    "answer": "Bài học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈles.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1145",
    "category": "english",
    "subCategory": "Trường học",
    "question": "Course",
    "answer": "Khoá học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɔːs/",
    "status": "new"
  },
  {
    "id": "oxford-1146",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Red",
    "answer": "Màu đỏ",
    "example": "Từ loại: adj/ n | Phiên âm: /rɛd/",
    "status": "new"
  },
  {
    "id": "oxford-1147",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Cream",
    "answer": "Màu kem",
    "example": "Từ loại: adj/ n | Phiên âm: /kriːm/",
    "status": "new"
  },
  {
    "id": "oxford-1148",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Purple",
    "answer": "Màu tía",
    "example": "Từ loại: adj/ n | Phiên âm: /ˈpɜːr.pəl/",
    "status": "new"
  },
  {
    "id": "oxford-1149",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Black",
    "answer": "Màu đen",
    "example": "Từ loại: adj/ n | Phiên âm: /blæk/",
    "status": "new"
  },
  {
    "id": "oxford-1150",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Gray",
    "answer": "Màu xám",
    "example": "Từ loại: n/ adj | Phiên âm: /ɡreɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1151",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Silver",
    "answer": "Màu bạc",
    "example": "Từ loại: n/ adj | Phiên âm: /ˈsɪl.vər/",
    "status": "new"
  },
  {
    "id": "oxford-1152",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Gold",
    "answer": "Màu vàng kim",
    "example": "Từ loại: n/ adj | Phiên âm: /ɡoʊld/",
    "status": "new"
  },
  {
    "id": "oxford-1153",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Copper",
    "answer": "Màu đồng",
    "example": "Từ loại: n/ adj | Phiên âm: /ˈkɒp.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1154",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Green",
    "answer": "Màu xanh lá cây",
    "example": "Từ loại: adj/ n | Phiên âm: /ɡriːn/",
    "status": "new"
  },
  {
    "id": "oxford-1155",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Pink",
    "answer": "Màu hồng",
    "example": "Từ loại: n/ adj | Phiên âm: /pɪŋk/",
    "status": "new"
  },
  {
    "id": "oxford-1156",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Yellow",
    "answer": "Màu vàng",
    "example": "Từ loại: n/ adj | Phiên âm: /ˈjɛl.oʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1157",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Brown",
    "answer": "Màu nâu",
    "example": "Từ loại: n/ adj | Phiên âm: /braʊn/",
    "status": "new"
  },
  {
    "id": "oxford-1158",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Blue",
    "answer": "Màu xanh da trời",
    "example": "Từ loại: n/ adj | Phiên âm: /bluː/",
    "status": "new"
  },
  {
    "id": "oxford-1159",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Chestnut",
    "answer": "Màu nâu hạt dẻ",
    "example": "Từ loại: n/ adj | Phiên âm: /ˈtʃɛs.nʌt/",
    "status": "new"
  },
  {
    "id": "oxford-1160",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Turquoise",
    "answer": "Màu ngọc lam",
    "example": "Từ loại: n/ adj | Phiên âm: /ˈtɜːr.kɔɪz/",
    "status": "new"
  },
  {
    "id": "oxford-1161",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Navy blue",
    "answer": "Màu xanh nước biển",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈneɪ.vi bluː/",
    "status": "new"
  },
  {
    "id": "oxford-1162",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Bright red",
    "answer": "(màu) đỏ tươi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /braɪt rɛd/",
    "status": "new"
  },
  {
    "id": "oxford-1163",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "Vivid",
    "answer": "Rực rỡ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈvɪv.ɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1164",
    "category": "english",
    "subCategory": "Màu sắc",
    "question": "White",
    "answer": "Màu trắng",
    "example": "Từ loại: adj/ n | Phiên âm: /waɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1165",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Weather",
    "answer": "Thời tiết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɛð.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1166",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Warm",
    "answer": "Ấm áp, ấm",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /wɔːrm/",
    "status": "new"
  },
  {
    "id": "oxford-1167",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Wind",
    "answer": "Gió",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /wɪnd/",
    "status": "new"
  },
  {
    "id": "oxford-1168",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Rain",
    "answer": "Mưa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /reɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1169",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Temperature",
    "answer": "Nhiệt độ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɛm.prə.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-1170",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Weather forecast",
    "answer": "Bản tin dự báo thời tiết",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈwɛð.ər ˈfɔːr.kæst/",
    "status": "new"
  },
  {
    "id": "oxford-1171",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Sunny",
    "answer": "Có nắng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsʌn.i/",
    "status": "new"
  },
  {
    "id": "oxford-1172",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Sunshine",
    "answer": "Ánh nắng mặt trời",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsʌn.ʃaɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1173",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Icy",
    "answer": "Lạnh lẽo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈaɪ.si/",
    "status": "new"
  },
  {
    "id": "oxford-1174",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Atmosphere",
    "answer": "Bầu khí quyển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæt.mə.sfɪər/",
    "status": "new"
  },
  {
    "id": "oxford-1175",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Dry",
    "answer": "Khô",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /draɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1176",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Sun",
    "answer": "Mặt trời",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sʌn/",
    "status": "new"
  },
  {
    "id": "oxford-1177",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Cloud",
    "answer": "Đám mây",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klaʊd/",
    "status": "new"
  },
  {
    "id": "oxford-1178",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Fog",
    "answer": "Sương mù",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fɔːɡ/",
    "status": "new"
  },
  {
    "id": "oxford-1179",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Snow",
    "answer": "Tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /snoʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1180",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Cold",
    "answer": "Lạnh",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /koʊld/",
    "status": "new"
  },
  {
    "id": "oxford-1181",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Cool",
    "answer": "Mát mẻ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /kuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1182",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Hot",
    "answer": "Nóng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /hɒt/",
    "status": "new"
  },
  {
    "id": "oxford-1183",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Wet",
    "answer": "Ẩm ướt",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /wɛt/",
    "status": "new"
  },
  {
    "id": "oxford-1184",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Erratic",
    "answer": "Thất thường",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ɪˈræt.ɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1185",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Thunder",
    "answer": "Sấm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈθʌn.dər/",
    "status": "new"
  },
  {
    "id": "oxford-1186",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Hailstone",
    "answer": "Viên mưa đá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈheɪl.stoʊn/",
    "status": "new"
  },
  {
    "id": "oxford-1187",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Blustery",
    "answer": "Có gió lớn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈblʌs.tər.i/",
    "status": "new"
  },
  {
    "id": "oxford-1188",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Downpour",
    "answer": "Mưa lớn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdaʊn.pɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-1189",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Raincoat",
    "answer": "Áo mưa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈreɪn.koʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1190",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Blizzard",
    "answer": "Bão tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈblɪz.ərd/",
    "status": "new"
  },
  {
    "id": "oxford-1191",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Rainbow",
    "answer": "Cầu vồng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈreɪn.boʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1192",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Dew",
    "answer": "Sương",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /djuː/",
    "status": "new"
  },
  {
    "id": "oxford-1193",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Sleet",
    "answer": "Mưa tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sliːt/",
    "status": "new"
  },
  {
    "id": "oxford-1194",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Stormy",
    "answer": "Có bão",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈstɔːr.mi/",
    "status": "new"
  },
  {
    "id": "oxford-1195",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Snowflake",
    "answer": "Bông tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsnoʊ.fleɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1196",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Puddle",
    "answer": "Vũng nước mưa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpʌd.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1197",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Lightning",
    "answer": "Tia chớp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪt.nɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1198",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Mild",
    "answer": "Ôn hoà",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /maɪld/",
    "status": "new"
  },
  {
    "id": "oxford-1199",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Dull",
    "answer": "U ám",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /dʌl/",
    "status": "new"
  },
  {
    "id": "oxford-1200",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Shelter",
    "answer": "Chỗ trú ẩn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʃɛl.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1201",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Celsius",
    "answer": "(thuộc) độ C",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈsɛl.si.əs/",
    "status": "new"
  },
  {
    "id": "oxford-1202",
    "category": "english",
    "subCategory": "Thời tiết",
    "question": "Fine",
    "answer": "Đẹp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /faɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1203",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Skirt",
    "answer": "Váy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skɜːrt/",
    "status": "new"
  },
  {
    "id": "oxford-1204",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Leggings",
    "answer": "Quần bó",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɛɡ.ɪŋz/",
    "status": "new"
  },
  {
    "id": "oxford-1205",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Overalls",
    "answer": "Quần yếm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈoʊ.vər.ɔːlz/",
    "status": "new"
  },
  {
    "id": "oxford-1206",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Turtleneck",
    "answer": "Áo cổ lọ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɜːr.tl̩.nɛk/",
    "status": "new"
  },
  {
    "id": "oxford-1207",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Bow tie",
    "answer": "Nơ con bướm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈboʊ taɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1208",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Tie",
    "answer": "Cà vạt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /taɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1209",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Tunic",
    "answer": "Áo trùm hông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtuː.nɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1210",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Vest",
    "answer": "Áo gi-lê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /vɛst/",
    "status": "new"
  },
  {
    "id": "oxford-1211",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "T-shirt",
    "answer": "Áo thun",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtiː.ʃɜːrt/",
    "status": "new"
  },
  {
    "id": "oxford-1212",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Shirt",
    "answer": "Áo sơ mi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃɜːrt/",
    "status": "new"
  },
  {
    "id": "oxford-1213",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Jeans",
    "answer": "Quần jean",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʒiːnz/",
    "status": "new"
  },
  {
    "id": "oxford-1214",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Dress",
    "answer": "Áo đầm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /drɛs/",
    "status": "new"
  },
  {
    "id": "oxford-1215",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Coat",
    "answer": "Áo khoác",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /koʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1216",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Jacket",
    "answer": "Áo khoác",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒæk.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1217",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Sweater",
    "answer": "Áo len",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈswɛt.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1218",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Jumpsuit",
    "answer": "Bộ áo liền quần",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒʌmp.suːt/",
    "status": "new"
  },
  {
    "id": "oxford-1219",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Shorts",
    "answer": "Quần đùi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃɔːrts/",
    "status": "new"
  },
  {
    "id": "oxford-1220",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Suit",
    "answer": "Bộ com lê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /suːt/",
    "status": "new"
  },
  {
    "id": "oxford-1221",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Anorak",
    "answer": "Áo ngoài có mũ trùm đầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæn.ə.ræk/",
    "status": "new"
  },
  {
    "id": "oxford-1222",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Hat",
    "answer": "Mũ, nón",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hæt/",
    "status": "new"
  },
  {
    "id": "oxford-1223",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Cap",
    "answer": "Mũ lưỡi trai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kæp/",
    "status": "new"
  },
  {
    "id": "oxford-1224",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Glove",
    "answer": "Găng tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡlʌv/",
    "status": "new"
  },
  {
    "id": "oxford-1225",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Scarf",
    "answer": "Khăn choàng cổ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skɑːrf/",
    "status": "new"
  },
  {
    "id": "oxford-1226",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Sandals",
    "answer": "Giày xăng-đan",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsæn.dəlz/",
    "status": "new"
  },
  {
    "id": "oxford-1227",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Slippers",
    "answer": "Đôi dép",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈslɪp.ərz/",
    "status": "new"
  },
  {
    "id": "oxford-1228",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Pocket",
    "answer": "Túi (quần áo)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɒk.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1229",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Sleeve",
    "answer": "Tay áo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sliːv/",
    "status": "new"
  },
  {
    "id": "oxford-1230",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Collar",
    "answer": "Cổ áo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒl.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1231",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Zip",
    "answer": "Khóa kéo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /zɪp/",
    "status": "new"
  },
  {
    "id": "oxford-1232",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Blouse",
    "answer": "Áo sơ mi nữ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /blaʊs/",
    "status": "new"
  },
  {
    "id": "oxford-1233",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Button",
    "answer": "Khuy, nút",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʌt.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1234",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Underwear",
    "answer": "Đồ lót",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʌn.dərˌwɛər/",
    "status": "new"
  },
  {
    "id": "oxford-1235",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Bra",
    "answer": "Áo ngực",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /brɑː/",
    "status": "new"
  },
  {
    "id": "oxford-1236",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Pants",
    "answer": "Quần dài",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pænts/",
    "status": "new"
  },
  {
    "id": "oxford-1237",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Belt",
    "answer": "Dây nịt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɛlt/",
    "status": "new"
  },
  {
    "id": "oxford-1238",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "High heels",
    "answer": "Giày cao gót",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /haɪ hiːlz/",
    "status": "new"
  },
  {
    "id": "oxford-1239",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Try on",
    "answer": "Thử (quần áo)",
    "example": "Từ loại: phrasal v | Phiên âm: /traɪ ɒn/",
    "status": "new"
  },
  {
    "id": "oxford-1240",
    "category": "english",
    "subCategory": "Quần áo",
    "question": "Size",
    "answer": "Kích cỡ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /saɪz/",
    "status": "new"
  },
  {
    "id": "oxford-1241",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Head",
    "answer": "Đầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɛd/",
    "status": "new"
  },
  {
    "id": "oxford-1242",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Face",
    "answer": "Khuôn mặt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /feɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1243",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Hair",
    "answer": "Tóc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɛr/",
    "status": "new"
  },
  {
    "id": "oxford-1244",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Ear",
    "answer": "Tai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪr/",
    "status": "new"
  },
  {
    "id": "oxford-1245",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Neck",
    "answer": "Cổ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /nɛk/",
    "status": "new"
  },
  {
    "id": "oxford-1246",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Forehead",
    "answer": "Trán",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɔːrˌhɛd/",
    "status": "new"
  },
  {
    "id": "oxford-1247",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Beard",
    "answer": "Râu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɪrd/",
    "status": "new"
  },
  {
    "id": "oxford-1248",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Eye",
    "answer": "Mắt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /aɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1249",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Nose",
    "answer": "Mũi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /noʊz/",
    "status": "new"
  },
  {
    "id": "oxford-1250",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Mouth",
    "answer": "Miệng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /maʊθ/",
    "status": "new"
  },
  {
    "id": "oxford-1251",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Chin",
    "answer": "Cằm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1252",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Shoulder",
    "answer": "Vai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʃoʊl.dər/",
    "status": "new"
  },
  {
    "id": "oxford-1253",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Elbow",
    "answer": "Khuỷu tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɛl.boʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1254",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Arm",
    "answer": "Cánh tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɑ:rm/",
    "status": "new"
  },
  {
    "id": "oxford-1255",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Chest",
    "answer": "Ngực",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɛst/",
    "status": "new"
  },
  {
    "id": "oxford-1256",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Armpit",
    "answer": "Nách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɑ:rmˌpɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1257",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Wrist",
    "answer": "Cổ tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪst/",
    "status": "new"
  },
  {
    "id": "oxford-1258",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Navel",
    "answer": "Rún, rốn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈneɪ.vəl/",
    "status": "new"
  },
  {
    "id": "oxford-1259",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Ankle",
    "answer": "Mắt cá chân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæŋ.kəl/",
    "status": "new"
  },
  {
    "id": "oxford-1260",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Waist",
    "answer": "Eo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /weɪst/",
    "status": "new"
  },
  {
    "id": "oxford-1261",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Abdomen",
    "answer": "Bụng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæb.də.mən/",
    "status": "new"
  },
  {
    "id": "oxford-1262",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Leg",
    "answer": "Chân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /lɛɡ/",
    "status": "new"
  },
  {
    "id": "oxford-1263",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Thigh",
    "answer": "Đùi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /θaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1264",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Knee",
    "answer": "Đầu gối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /niː/",
    "status": "new"
  },
  {
    "id": "oxford-1265",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Hand",
    "answer": "Bàn tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hænd/",
    "status": "new"
  },
  {
    "id": "oxford-1266",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Thumb",
    "answer": "Ngón tay cái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /θʌm/",
    "status": "new"
  },
  {
    "id": "oxford-1267",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Back",
    "answer": "Lưng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bæk/",
    "status": "new"
  },
  {
    "id": "oxford-1268",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Foot",
    "answer": "Bàn chân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1269",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Finger",
    "answer": "Ngón tay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɪŋ.ɡər/",
    "status": "new"
  },
  {
    "id": "oxford-1270",
    "category": "english",
    "subCategory": "Bộ phận cơ thể",
    "question": "Toe",
    "answer": "Ngón chân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /toʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1271",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Boarding school",
    "answer": "Trường nội trú",
    "example": "Từ loại: Cụm danh từ | Phiên âm: ˈbɔːrd.ɪŋ skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1272",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Public school",
    "answer": "Trường công lập",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpʌb.lɪk skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1273",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Private school",
    "answer": "Trường tư thục",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpraɪ.vɪt skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1274",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Secondary school",
    "answer": "Trường trung học cơ sở",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsɛk.ənˌdɛr.i skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1275",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "High school",
    "answer": "Trường trung học phổ thông",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /haɪ skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1276",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Primary school",
    "answer": "Trường tiểu học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpraɪˌmɛr.i skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1277",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Nursery school",
    "answer": "Trường mẫu giáo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈnɜːr.sər.i skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1278",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "School",
    "answer": "Trường học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skuːl/",
    "status": "new"
  },
  {
    "id": "oxford-1279",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "College",
    "answer": "Trường đại học, cao đẳng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒl.ɪdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-1280",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "University",
    "answer": "Trường đại học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌjuː.nɪˈvɜːr.sə.ti/",
    "status": "new"
  },
  {
    "id": "oxford-1281",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Professor",
    "answer": "Giáo sư",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /prəˈfɛs.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1282",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Lecturer",
    "answer": "Giảng viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɛk.tʃər.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1283",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Researcher",
    "answer": "Nghiên cứu viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪˈsɜːr.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-1284",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Graduate",
    "answer": "Tốt nghiệp",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈɡrædʒ.u.eɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1285",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Degree",
    "answer": "Bằng cấp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈɡriː/",
    "status": "new"
  },
  {
    "id": "oxford-1286",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Thesis",
    "answer": "Luận văn, luận án",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈθiː.sɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1287",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Lecture",
    "answer": "Bài giảng, bài thuyết trình",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɛk.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-1288",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Debate",
    "answer": "Cuộc tranh luận",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈbeɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1289",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Higher education",
    "answer": "Giáo dục đại học",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈhaɪ.ər ˌɛdʒ.əˈkeɪ.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1290",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Semester",
    "answer": "Học kỳ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sɪˈmɛs.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1291",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Student",
    "answer": "Sinh viên, học sinh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstjuː.dənt/",
    "status": "new"
  },
  {
    "id": "oxford-1292",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Student union",
    "answer": "Hội sinh viên",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈstjuː.dənt ˈjuː.njən/",
    "status": "new"
  },
  {
    "id": "oxford-1293",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Tuition fee",
    "answer": "Học phí",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /tjuːˈɪʃ.ən fiː/",
    "status": "new"
  },
  {
    "id": "oxford-1294",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Exam",
    "answer": "Bài thi, kì thi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪɡˈzæm/",
    "status": "new"
  },
  {
    "id": "oxford-1295",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Fail",
    "answer": "Thi trượt",
    "example": "Từ loại: Động từ (v) | Phiên âm: /feɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1296",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Pass",
    "answer": "Đậu, đỗ",
    "example": "Từ loại: Động từ (v) | Phiên âm: /pæs/",
    "status": "new"
  },
  {
    "id": "oxford-1297",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Study",
    "answer": "Học",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈstʌd.i/",
    "status": "new"
  },
  {
    "id": "oxford-1298",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Learn",
    "answer": "Học",
    "example": "Từ loại: Động từ (v) | Phiên âm: /lɜːrn/",
    "status": "new"
  },
  {
    "id": "oxford-1299",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Curriculum",
    "answer": "Chương trình giảng dạy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəˈrɪk.jə.ləm/",
    "status": "new"
  },
  {
    "id": "oxford-1300",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Course",
    "answer": "Khóa học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɔːrs/",
    "status": "new"
  },
  {
    "id": "oxford-1301",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Subject",
    "answer": "Môn học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsʌb.dʒɪkt/",
    "status": "new"
  },
  {
    "id": "oxford-1302",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Grade",
    "answer": "Điểm số",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡreɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1303",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Mark",
    "answer": "Điểm số",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɑːrk/",
    "status": "new"
  },
  {
    "id": "oxford-1304",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Qualification",
    "answer": "Trình độ chuyên môn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌkwɒl.ɪ.fɪˈkeɪ.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1305",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Attendance",
    "answer": "Sự có mặt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈtɛn.dəns/",
    "status": "new"
  },
  {
    "id": "oxford-1306",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Absence",
    "answer": "Sự vắng mặt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæb.səns/",
    "status": "new"
  },
  {
    "id": "oxford-1307",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Projector",
    "answer": "Máy chiếu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /prəˈdʒɛk.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1308",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Textbook",
    "answer": "Sách giáo khoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɛkstˌbʊk/",
    "status": "new"
  },
  {
    "id": "oxford-1309",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Question",
    "answer": "Câu hỏi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkwɛs.tʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1310",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Answer",
    "answer": "Trả lời",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈæn.sər/",
    "status": "new"
  },
  {
    "id": "oxford-1311",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Mistake",
    "answer": "Sai lầm, lỗi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɪˈsteɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1312",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Right",
    "answer": "Đúng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /raɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1313",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Wrong",
    "answer": "Sai",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /rɒŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1314",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Register",
    "answer": "Sổ sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrɛdʒ.ɪ.stər/",
    "status": "new"
  },
  {
    "id": "oxford-1315",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Assembly",
    "answer": "Cuộc họp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈsɛm.bli/",
    "status": "new"
  },
  {
    "id": "oxford-1316",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Holiday",
    "answer": "Kỳ nghỉ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɒl.ɪ.deɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1317",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Teacher",
    "answer": "Giáo viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtiː.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-1318",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Pupil",
    "answer": "Học sinh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpjuː.pəl/",
    "status": "new"
  },
  {
    "id": "oxford-1319",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Playground",
    "answer": "Sân chơi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpleɪ.ɡraʊnd/",
    "status": "new"
  },
  {
    "id": "oxford-1320",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Library",
    "answer": "Thư viện",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪ.brər.i/",
    "status": "new"
  },
  {
    "id": "oxford-1321",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Hall",
    "answer": "Hội trường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-1322",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Dormitory",
    "answer": "Ký túc xá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɔːr.mɪ.tɔːr.i/",
    "status": "new"
  },
  {
    "id": "oxford-1323",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Locker",
    "answer": "Tủ có khoá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɒk.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1324",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Classroom",
    "answer": "Phòng học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈklæs.ruːm/",
    "status": "new"
  },
  {
    "id": "oxford-1325",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Chalk",
    "answer": "Phấn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɔːk/",
    "status": "new"
  },
  {
    "id": "oxford-1326",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Lesson",
    "answer": "Bài học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɛs.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1327",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Homework",
    "answer": "Bài tập về nhà",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhoʊm.wɜːrk/",
    "status": "new"
  },
  {
    "id": "oxford-1328",
    "category": "english",
    "subCategory": "Giáo dục",
    "question": "Test",
    "answer": "Bài kiểm tra",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tɛst/",
    "status": "new"
  },
  {
    "id": "oxford-1329",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Husband",
    "answer": "Chồng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhʌz.bənd/",
    "status": "new"
  },
  {
    "id": "oxford-1330",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Grandson",
    "answer": "Cháu trai (của ông bà)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡrænd.sʌn/",
    "status": "new"
  },
  {
    "id": "oxford-1331",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Uncle",
    "answer": "Chú, cậu,…",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʌŋ.kəl/",
    "status": "new"
  },
  {
    "id": "oxford-1332",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Aunt",
    "answer": "Cô, dì,…",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ænt/",
    "status": "new"
  },
  {
    "id": "oxford-1333",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Niece",
    "answer": "Cháu gái (của cô, dì, chú)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /niːs/",
    "status": "new"
  },
  {
    "id": "oxford-1334",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Nephew",
    "answer": "Cháu trai (của cô, dì, chú)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnɛ.vjuː/",
    "status": "new"
  },
  {
    "id": "oxford-1335",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Son-in-law",
    "answer": "Con rể",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsʌn ɪn lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-1336",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Daughter-in-law",
    "answer": "Con dâu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɔː.tər ɪn lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-1337",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Granddaughter",
    "answer": "Cháu gái (của ông bà)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡrændˌdɔː.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1338",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Grandfather",
    "answer": "Ông nội, ông ngoại",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡrændˌfɑː.ðər/",
    "status": "new"
  },
  {
    "id": "oxford-1339",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Wife",
    "answer": "Vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /waɪf/",
    "status": "new"
  },
  {
    "id": "oxford-1340",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Father",
    "answer": "Bố",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɑː.ðər/",
    "status": "new"
  },
  {
    "id": "oxford-1341",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Mother",
    "answer": "Mẹ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmʌð.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1342",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Daughter",
    "answer": "Con gái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɔː.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1343",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Son",
    "answer": "Con trai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sʌn/",
    "status": "new"
  },
  {
    "id": "oxford-1344",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Sister",
    "answer": "Chị gái, em gái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɪs.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1345",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Brother",
    "answer": "Anh trai, em trai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbrʌð.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1346",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Grandmother",
    "answer": "Bà nội, bà ngoại",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡrændˌmʌð.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1347",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Brother-in-law",
    "answer": "Anh/em rể, anh/em chồng, anh/em vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbrʌð.ər ɪn lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-1348",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Cousin",
    "answer": "Anh họ, em họ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌz.ɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1349",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Parent",
    "answer": "Bố, mẹ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɛr.ənt/",
    "status": "new"
  },
  {
    "id": "oxford-1350",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Relative",
    "answer": "Họ hàng, người thân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrɛl.ə.tɪv/",
    "status": "new"
  },
  {
    "id": "oxford-1351",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Mother-in-law",
    "answer": "Mẹ chồng, mẹ vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmʌð.ər ɪn lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-1352",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Father-in-law",
    "answer": "Bố chồng, bố vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɑː.ðər ɪn lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-1353",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Sister-in-law",
    "answer": "Chị/em dâu, chị/em chồng, chị/em vợ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɪs.tər ɪn lɔː/",
    "status": "new"
  },
  {
    "id": "oxford-1354",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Adopt",
    "answer": "Nhận con nuôi",
    "example": "Từ loại: Động từ (v) | Phiên âm: /əˈdɒpt/",
    "status": "new"
  },
  {
    "id": "oxford-1355",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Children",
    "answer": "Con cái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɪl.drən/",
    "status": "new"
  },
  {
    "id": "oxford-1356",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Take care of",
    "answer": "Chăm sóc, quan tâm",
    "example": "Từ loại: Cụm động từ | Phiên âm: /teɪk kɛər əv/",
    "status": "new"
  },
  {
    "id": "oxford-1357",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Family tree",
    "answer": "Gia phả",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfæm.ə.li triː/",
    "status": "new"
  },
  {
    "id": "oxford-1358",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Anniversary",
    "answer": "Ngày kỷ niệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌæn.ɪˈvɜː.sə.ri/",
    "status": "new"
  },
  {
    "id": "oxford-1359",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Close-knit",
    "answer": "Khăng khít",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: ˌkloʊsˈnɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1360",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Stepchild",
    "answer": "Con riêng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstɛpˌtʃaɪld/",
    "status": "new"
  },
  {
    "id": "oxford-1361",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Half-brother",
    "answer": "Anh trai, em trai (cùng cha/mẹ khác mẹ/cha)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɑːfˌbrʌð.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1362",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Half-sister",
    "answer": "Chị gái, em gái (cùng cha/mẹ khác mẹ/cha)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɑːfˌsɪs.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1363",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Godfather",
    "answer": "Cha đỡ đầu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡɒdˌfɑː.ðər/",
    "status": "new"
  },
  {
    "id": "oxford-1364",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Hereditary",
    "answer": "Di truyền",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /həˈrɛd.ɪ.tər.i/",
    "status": "new"
  },
  {
    "id": "oxford-1365",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Stepmother",
    "answer": "Mẹ kế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstɛpˌmʌð.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1366",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Stepfather",
    "answer": "Cha dượng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstɛpˌfɑː.ðər/",
    "status": "new"
  },
  {
    "id": "oxford-1367",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Orphan",
    "answer": "Trẻ mồ côi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɔːr.fən/",
    "status": "new"
  },
  {
    "id": "oxford-1368",
    "category": "english",
    "subCategory": "Gia đình",
    "question": "Generation",
    "answer": "Thế hệ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌdʒɛn.əˈreɪ.ʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1369",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Orange",
    "answer": "Quả cam",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɔːr.ɪndʒ/",
    "status": "new"
  },
  {
    "id": "oxford-1370",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Lemon",
    "answer": "Quả chanh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɛm.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1371",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Mango",
    "answer": "Quả xoài",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmæŋ.ɡoʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1372",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Apple",
    "answer": "Quả táo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæp.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1373",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Tangerine",
    "answer": "Quả quýt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌtæn.dʒəˈriːn/",
    "status": "new"
  },
  {
    "id": "oxford-1374",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Grape",
    "answer": "Quả nho",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡreɪp/",
    "status": "new"
  },
  {
    "id": "oxford-1375",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Strawberry",
    "answer": "Quả dâu tây",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstrɔːˌbɛr.i/",
    "status": "new"
  },
  {
    "id": "oxford-1376",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Melon",
    "answer": "Quả dưa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɛl.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1377",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Passion fruit",
    "answer": "Quả chanh dây",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpæʃ.ən ˌfruːt/",
    "status": "new"
  },
  {
    "id": "oxford-1378",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Grapefruit",
    "answer": "Quả bưởi chùm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡreɪpˌfruːt/",
    "status": "new"
  },
  {
    "id": "oxford-1379",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Watermelon",
    "answer": "Quả dưa hấu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔː.tərˌmɛl.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1380",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Peach",
    "answer": "Quả đào",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /piːtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1381",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Pear",
    "answer": "Quả lê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɛr/",
    "status": "new"
  },
  {
    "id": "oxford-1382",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Banana",
    "answer": "Quả chuối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bəˈnæn.ə/",
    "status": "new"
  },
  {
    "id": "oxford-1383",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Plum",
    "answer": "Quả mận",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /plʌm/",
    "status": "new"
  },
  {
    "id": "oxford-1384",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Papaya",
    "answer": "Quả đu đủ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pəˈpaɪ.ə/",
    "status": "new"
  },
  {
    "id": "oxford-1385",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Avocado",
    "answer": "Quả bơ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌæv.əˈkɑː.doʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1386",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Starfruit",
    "answer": "Quả khế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstɑːrˌfruːt/",
    "status": "new"
  },
  {
    "id": "oxford-1387",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Pineapple",
    "answer": "Quả dứa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpaɪnˌæp.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1388",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Coconut",
    "answer": "Quả dừa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkoʊ.kəˌnʌt/",
    "status": "new"
  },
  {
    "id": "oxford-1389",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Raspberry",
    "answer": "Quả mâm xôi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈræzˌbɛr.i/",
    "status": "new"
  },
  {
    "id": "oxford-1390",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Nectarine",
    "answer": "Quả xuân đào",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnɛk.təˌriːn/",
    "status": "new"
  },
  {
    "id": "oxford-1391",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Mulberry",
    "answer": "Quả dâu tằm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmʌlˌbɛr.i/",
    "status": "new"
  },
  {
    "id": "oxford-1392",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Raisin",
    "answer": "Nho khô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈreɪ.zən/",
    "status": "new"
  },
  {
    "id": "oxford-1393",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Jackfruit",
    "answer": "Quả mít",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒækˌfruːt/",
    "status": "new"
  },
  {
    "id": "oxford-1394",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Persimmon",
    "answer": "Quả hồng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pərˈsɪm.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1395",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Dragon fruit",
    "answer": "Quả thanh long",
    "example": "Từ loại: Cụm danh từ | Phiên âm: ˈdræɡ.ən ˌfruːt/",
    "status": "new"
  },
  {
    "id": "oxford-1396",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Custard apple",
    "answer": "Quả na",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkʌs.tərd ˌæp.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1397",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Quince",
    "answer": "Quả mộc qua",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kwɪns/",
    "status": "new"
  },
  {
    "id": "oxford-1398",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Cherry",
    "answer": "Quả anh đào",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɛr.i/",
    "status": "new"
  },
  {
    "id": "oxford-1399",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Kiwi",
    "answer": "Quả kiwi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkiː.wi/",
    "status": "new"
  },
  {
    "id": "oxford-1400",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Pomegranate",
    "answer": "Quả lựu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɒm.ɪˌɡræn.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1401",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Guava",
    "answer": "Quả ổi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡwɑː.və/",
    "status": "new"
  },
  {
    "id": "oxford-1402",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Apricot",
    "answer": "Quả mơ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈeɪ.prɪˌkɒt/",
    "status": "new"
  },
  {
    "id": "oxford-1403",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Blueberry",
    "answer": "Quả việt quất",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbluːˌbɛr.i/",
    "status": "new"
  },
  {
    "id": "oxford-1404",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Durian",
    "answer": "Quả sầu riêng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʊr.i.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1405",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Lychee",
    "answer": "Quả vải",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪ.tʃiː/",
    "status": "new"
  },
  {
    "id": "oxford-1406",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Tamarind",
    "answer": "Quả me",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtæm.ər.ɪnd/",
    "status": "new"
  },
  {
    "id": "oxford-1407",
    "category": "english",
    "subCategory": "Trái cây",
    "question": "Kumquat",
    "answer": "Quả quất",
    "example": "Từ loại: Danh từ (n) | Phiên âm: ˈkʌm.kwɒt/",
    "status": "new"
  },
  {
    "id": "oxford-1408",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Piglet",
    "answer": "Lợn con",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɪɡ.lɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1409",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Sow",
    "answer": "Lợn cái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /saʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1410",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Pig",
    "answer": "Lợn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɪɡ/",
    "status": "new"
  },
  {
    "id": "oxford-1411",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Duck",
    "answer": "Vịt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʌk/",
    "status": "new"
  },
  {
    "id": "oxford-1412",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Animal",
    "answer": "Động vật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæn.ɪ.məl/",
    "status": "new"
  },
  {
    "id": "oxford-1413",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Goat",
    "answer": "Dê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡoʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1414",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Horse",
    "answer": "Ngựa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɔːrs/",
    "status": "new"
  },
  {
    "id": "oxford-1415",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Goose",
    "answer": "Ngỗng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡuːs/",
    "status": "new"
  },
  {
    "id": "oxford-1416",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Donkey",
    "answer": "Lừa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɒŋ.ki/",
    "status": "new"
  },
  {
    "id": "oxford-1417",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Sheep",
    "answer": "Cừu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃiːp/",
    "status": "new"
  },
  {
    "id": "oxford-1418",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Ox",
    "answer": "Bò",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɒks/",
    "status": "new"
  },
  {
    "id": "oxford-1419",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Dog",
    "answer": "Chó",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɒɡ/",
    "status": "new"
  },
  {
    "id": "oxford-1420",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Cat",
    "answer": "Mèo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kæt/",
    "status": "new"
  },
  {
    "id": "oxford-1421",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Chicken",
    "answer": "Gà",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɪk.ɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1422",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Rooster",
    "answer": "Gà trống",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈruː.stər/",
    "status": "new"
  },
  {
    "id": "oxford-1423",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Hen",
    "answer": "Gà mái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɛn/",
    "status": "new"
  },
  {
    "id": "oxford-1424",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Cow",
    "answer": "Bò cái",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kaʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1425",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Bull",
    "answer": "Bò đực",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bʊl/",
    "status": "new"
  },
  {
    "id": "oxford-1426",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Calf",
    "answer": "Bê",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɑːf/",
    "status": "new"
  },
  {
    "id": "oxford-1427",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Rabbit",
    "answer": "Thỏ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈræb.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1428",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Owl",
    "answer": "Cú",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /aʊl/",
    "status": "new"
  },
  {
    "id": "oxford-1429",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Deer",
    "answer": "Hươu, nai",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪr/",
    "status": "new"
  },
  {
    "id": "oxford-1430",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Bat",
    "answer": "Dơi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: bæt/",
    "status": "new"
  },
  {
    "id": "oxford-1431",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Mink",
    "answer": "Chồn vizon",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɪŋk/",
    "status": "new"
  },
  {
    "id": "oxford-1432",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Monkey",
    "answer": "Khỉ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmʌŋ.ki/",
    "status": "new"
  },
  {
    "id": "oxford-1433",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Snake",
    "answer": "Rắn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sneɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1434",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Lizard",
    "answer": "Thằn lằn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɪz.ərd/",
    "status": "new"
  },
  {
    "id": "oxford-1435",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Giraffe",
    "answer": "Hươu cao cổ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʒəˈræf/",
    "status": "new"
  },
  {
    "id": "oxford-1436",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Bear",
    "answer": "Gấu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɛr/",
    "status": "new"
  },
  {
    "id": "oxford-1437",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Rhino",
    "answer": "Tê giác",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈraɪ.noʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1438",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Elephant",
    "answer": "Voi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɛl.ɪ.fənt/",
    "status": "new"
  },
  {
    "id": "oxford-1439",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Panther",
    "answer": "Báo đen",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpæn.θər/",
    "status": "new"
  },
  {
    "id": "oxford-1440",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Leopard",
    "answer": "Báo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɛp.ərd/",
    "status": "new"
  },
  {
    "id": "oxford-1441",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Tiger",
    "answer": "Hổ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtaɪ.ɡər/",
    "status": "new"
  },
  {
    "id": "oxford-1442",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Lion",
    "answer": "Sư tử",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlaɪ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1443",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Fox",
    "answer": "Cáo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fɒks/",
    "status": "new"
  },
  {
    "id": "oxford-1444",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Dinosaur",
    "answer": "Khủng long",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdaɪ.nəˌsɔːr/",
    "status": "new"
  },
  {
    "id": "oxford-1445",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Turtle",
    "answer": "Rùa biển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɜːr.təl/",
    "status": "new"
  },
  {
    "id": "oxford-1446",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Snail",
    "answer": "Ốc sên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sneɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1447",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Crow",
    "answer": "Quạ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kroʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1448",
    "category": "english",
    "subCategory": "Động vật",
    "question": "Parrot",
    "answer": "Vẹt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpær.ət/",
    "status": "new"
  },
  {
    "id": "oxford-1449",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Caterpillar",
    "answer": "Sâu bướm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkæt.ərˌpɪl.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1450",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Cocoon",
    "answer": "Cái kén (tằm)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəˈkuːn/",
    "status": "new"
  },
  {
    "id": "oxford-1451",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Butterfly",
    "answer": "Bướm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʌt.ərˌflaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1452",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Dragonfly",
    "answer": "Chuồn chuồn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdræɡ.ənˌflaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1453",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Cricket",
    "answer": "Dế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkrɪk.ɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1454",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Grasshopper",
    "answer": "Châu chấu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡræsˌhɒp.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1455",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Cockroach",
    "answer": "Gián",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒkˌroʊtʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1456",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Beetle",
    "answer": "Bọ cánh cứng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbiː.təl/",
    "status": "new"
  },
  {
    "id": "oxford-1457",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Termite",
    "answer": "Mối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɜːr.maɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1458",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Ant",
    "answer": "Kiến",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ænt/",
    "status": "new"
  },
  {
    "id": "oxford-1459",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Mosquito",
    "answer": "Muỗi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /məˈskiː.toʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1460",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Ladybug",
    "answer": "Bọ rùa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈleɪ.diˌbʌɡ/",
    "status": "new"
  },
  {
    "id": "oxford-1461",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Spider",
    "answer": "Nhện",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈspaɪ.dər/",
    "status": "new"
  },
  {
    "id": "oxford-1462",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Firefly",
    "answer": "Đom đóm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfaɪrˌflaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1463",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Fly",
    "answer": "Ruồi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /flaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1464",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Bee",
    "answer": "Ong",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /biː/",
    "status": "new"
  },
  {
    "id": "oxford-1465",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Wasp",
    "answer": "Ong bắp cày",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /wɒsp/",
    "status": "new"
  },
  {
    "id": "oxford-1466",
    "category": "english",
    "subCategory": "Côn trùng",
    "question": "Centipede",
    "answer": "Rết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɛn.tɪˌpiːd/",
    "status": "new"
  },
  {
    "id": "oxford-1467",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Class",
    "answer": "Lớp học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klæs/",
    "status": "new"
  },
  {
    "id": "oxford-1468",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Classroom",
    "answer": "Phòng học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈklæsˌruːm/",
    "status": "new"
  },
  {
    "id": "oxford-1469",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Textbook",
    "answer": "Sách giáo khoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɛkstˌbʊk/",
    "status": "new"
  },
  {
    "id": "oxford-1470",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Workbook",
    "answer": "Sách bài tập",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɜːkˌbʊk/",
    "status": "new"
  },
  {
    "id": "oxford-1471",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Reference book",
    "answer": "Sách tham khảo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈrɛf.ər.əns ˌbʊk/",
    "status": "new"
  },
  {
    "id": "oxford-1472",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Notebook",
    "answer": "Vở",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnoʊtˌbʊk/",
    "status": "new"
  },
  {
    "id": "oxford-1473",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Notepad",
    "answer": "Sổ ghi chép",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnoʊtˌpæd/",
    "status": "new"
  },
  {
    "id": "oxford-1474",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Pencil",
    "answer": "Bút chì",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɛn.səl/",
    "status": "new"
  },
  {
    "id": "oxford-1475",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Crayon",
    "answer": "Bút chì màu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkreɪ.ɒn/",
    "status": "new"
  },
  {
    "id": "oxford-1476",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Pencil sharpener",
    "answer": "Đồ gọt bút chì",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpɛn.səl ˌʃɑːp.nər/",
    "status": "new"
  },
  {
    "id": "oxford-1477",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Eraser",
    "answer": "Cục tẩy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪˈreɪ.zər/",
    "status": "new"
  },
  {
    "id": "oxford-1478",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Pen",
    "answer": "Bút mực",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pɛn/",
    "status": "new"
  },
  {
    "id": "oxford-1479",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Ballpoint pen",
    "answer": "Bút bi",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbɔːl.pɔɪnt ˌpɛn/",
    "status": "new"
  },
  {
    "id": "oxford-1480",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Paper",
    "answer": "Giấy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpeɪ.pər/",
    "status": "new"
  },
  {
    "id": "oxford-1481",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Desk",
    "answer": "Bàn học",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɛsk/",
    "status": "new"
  },
  {
    "id": "oxford-1482",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Map",
    "answer": "Bản đồ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mæp/",
    "status": "new"
  },
  {
    "id": "oxford-1483",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Glue",
    "answer": "Hồ dán",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡluː/",
    "status": "new"
  },
  {
    "id": "oxford-1484",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Scissors",
    "answer": "Kéo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɪz.ərz/",
    "status": "new"
  },
  {
    "id": "oxford-1485",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Ruler",
    "answer": "Thước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈruː.lər/",
    "status": "new"
  },
  {
    "id": "oxford-1486",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Protractor",
    "answer": "Thước đo góc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /prəˈtræk.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1487",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Ink",
    "answer": "Mực",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪŋk/",
    "status": "new"
  },
  {
    "id": "oxford-1488",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Chalk",
    "answer": "Phấn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tʃɔːk/",
    "status": "new"
  },
  {
    "id": "oxford-1489",
    "category": "english",
    "subCategory": "Học tập",
    "question": "Folder",
    "answer": "Thư mục",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfoʊl.dər/",
    "status": "new"
  },
  {
    "id": "oxford-1490",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Tree",
    "answer": "Cây",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /triː/",
    "status": "new"
  },
  {
    "id": "oxford-1491",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Pine",
    "answer": "Cây thông",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /paɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1492",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Cedar",
    "answer": "Cây tuyết tùng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsiː.dər/",
    "status": "new"
  },
  {
    "id": "oxford-1493",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Oak",
    "answer": "Cây sồi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /oʊk/",
    "status": "new"
  },
  {
    "id": "oxford-1494",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Ivy",
    "answer": "Dây thường xuân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈaɪ.vi/",
    "status": "new"
  },
  {
    "id": "oxford-1495",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Moss",
    "answer": "Rêu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /mɔːs/",
    "status": "new"
  },
  {
    "id": "oxford-1496",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Mushroom",
    "answer": "Nấm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmʌʃ.rʊm/",
    "status": "new"
  },
  {
    "id": "oxford-1497",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Wheat",
    "answer": "Lúa mì",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /wiːt/",
    "status": "new"
  },
  {
    "id": "oxford-1498",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Corn",
    "answer": "Bắp, ngô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kɔːrn/",
    "status": "new"
  },
  {
    "id": "oxford-1499",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Flower",
    "answer": "Hoa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈflaʊ.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1500",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Grass",
    "answer": "Cỏ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡræs/",
    "status": "new"
  },
  {
    "id": "oxford-1501",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Herb",
    "answer": "Thảo mộc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /hɜːrb/",
    "status": "new"
  },
  {
    "id": "oxford-1502",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Bush",
    "answer": "Bụi cây, bụi rậm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bʊʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1503",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Coconut tree",
    "answer": "Cây dừa",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkoʊ.kəˌnʌt triː/",
    "status": "new"
  },
  {
    "id": "oxford-1504",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Apple tree",
    "answer": "Cây táo",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈæpəl triː/",
    "status": "new"
  },
  {
    "id": "oxford-1505",
    "category": "english",
    "subCategory": "Thực vật",
    "question": "Shrubland",
    "answer": "Vùng cây bụi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʃrʌblænd/",
    "status": "new"
  },
  {
    "id": "oxford-1506",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Denmark",
    "answer": "Đan Mạch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɛnˌmɑːrk/",
    "status": "new"
  },
  {
    "id": "oxford-1507",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "England",
    "answer": "Anh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɪŋ.ɡlənd/",
    "status": "new"
  },
  {
    "id": "oxford-1508",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Sweden",
    "answer": "Thụy Điển",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈswiː.dən/",
    "status": "new"
  },
  {
    "id": "oxford-1509",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Austria",
    "answer": "Áo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɒs.tri.ə/",
    "status": "new"
  },
  {
    "id": "oxford-1510",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Australia",
    "answer": "Úc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɒˈstreɪlɪə/",
    "status": "new"
  },
  {
    "id": "oxford-1511",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "France",
    "answer": "Pháp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fræns/",
    "status": "new"
  },
  {
    "id": "oxford-1512",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Germany",
    "answer": "Đức",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒɜː.mə.ni/",
    "status": "new"
  },
  {
    "id": "oxford-1513",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Switzerland",
    "answer": "Thụy Sĩ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈswɪtsərlənd/",
    "status": "new"
  },
  {
    "id": "oxford-1514",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Greece",
    "answer": "Hy Lạp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡriːs/",
    "status": "new"
  },
  {
    "id": "oxford-1515",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Italy",
    "answer": "Ý",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɪtəli/",
    "status": "new"
  },
  {
    "id": "oxford-1516",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Spain",
    "answer": "Tây Ban Nha",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /speɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1517",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Russia",
    "answer": "Nga",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈrʌʃə/",
    "status": "new"
  },
  {
    "id": "oxford-1518",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Canada",
    "answer": "Canada",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkænədə/",
    "status": "new"
  },
  {
    "id": "oxford-1519",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Mexico",
    "answer": "Mêxicô",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɛksɪkoʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1520",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "America",
    "answer": "Mỹ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈmɛrɪkə/",
    "status": "new"
  },
  {
    "id": "oxford-1521",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Brazil",
    "answer": "Braxin",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /brəˈzɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1522",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Japan",
    "answer": "Nhật Bản",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dʒəˈpæn/",
    "status": "new"
  },
  {
    "id": "oxford-1523",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "Korea",
    "answer": "Hàn Quốc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəˈriə/",
    "status": "new"
  },
  {
    "id": "oxford-1524",
    "category": "english",
    "subCategory": "Quốc gia",
    "question": "China",
    "answer": "Trung Quốc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃaɪ.nə/",
    "status": "new"
  },
  {
    "id": "oxford-1525",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Herring",
    "answer": "Cá trích",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɛr.ɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1526",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Skate",
    "answer": "Cá đuối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skeɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1527",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Salmon",
    "answer": "Cá hồi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsæmən/",
    "status": "new"
  },
  {
    "id": "oxford-1528",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Prawn",
    "answer": "Tôm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /prɔːn/",
    "status": "new"
  },
  {
    "id": "oxford-1529",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Cuttlefish",
    "answer": "Mực nang",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkʌtəl.fɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1530",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Lobster",
    "answer": "Tôm hùm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈlɒbstər/",
    "status": "new"
  },
  {
    "id": "oxford-1531",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Squid",
    "answer": "Mực ống",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /skwɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1532",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Shrimp",
    "answer": "Tôm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃrɪmp/",
    "status": "new"
  },
  {
    "id": "oxford-1533",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Oyster",
    "answer": "Hàu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɔɪ.stər/",
    "status": "new"
  },
  {
    "id": "oxford-1534",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Crab",
    "answer": "Cua",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kræb/",
    "status": "new"
  },
  {
    "id": "oxford-1535",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Cockle",
    "answer": "Sò",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒk.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1536",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Scallop",
    "answer": "Sò điệp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈskɒl.əp/",
    "status": "new"
  },
  {
    "id": "oxford-1537",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Octopus",
    "answer": "Bạch tuộc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɒk.tə.pʊs/",
    "status": "new"
  },
  {
    "id": "oxford-1538",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Fish",
    "answer": "Cá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /fɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1539",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Eel",
    "answer": "Lươn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /iːl/",
    "status": "new"
  },
  {
    "id": "oxford-1540",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Mussel",
    "answer": "Vẹm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmʌsəl/",
    "status": "new"
  },
  {
    "id": "oxford-1541",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Clam",
    "answer": "Nghêu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klæm/",
    "status": "new"
  },
  {
    "id": "oxford-1542",
    "category": "english",
    "subCategory": "Hải sản",
    "question": "Jellyfish",
    "answer": "Sứa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒɛliˌfɪʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1543",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Charcoal",
    "answer": "Than củi",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtʃɑːrˌkoʊl/",
    "status": "new"
  },
  {
    "id": "oxford-1544",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Battery",
    "answer": "Pin",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbætəri/",
    "status": "new"
  },
  {
    "id": "oxford-1545",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Gasoline",
    "answer": "Xăng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡæsəˌliːn/",
    "status": "new"
  },
  {
    "id": "oxford-1546",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Turbine",
    "answer": "Tua-bin",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɜr.baɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1547",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Sun",
    "answer": "Mặt trời",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /sʌn/",
    "status": "new"
  },
  {
    "id": "oxford-1548",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Wind",
    "answer": "Gió",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /wɪnd/",
    "status": "new"
  },
  {
    "id": "oxford-1549",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Waterfall",
    "answer": "Thác nước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɔːtərˌfɔːl/",
    "status": "new"
  },
  {
    "id": "oxford-1550",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Refinery",
    "answer": "Nhà máy lọc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /rɪˈfaɪnəri/",
    "status": "new"
  },
  {
    "id": "oxford-1551",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Nuclear reactor",
    "answer": "Lò phản ứng hạt nhân",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈnjuː.kliər riˈæktər/",
    "status": "new"
  },
  {
    "id": "oxford-1552",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Dam",
    "answer": "Đập (thủy điện)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dæm/",
    "status": "new"
  },
  {
    "id": "oxford-1553",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Power plant",
    "answer": "Nhà máy điện",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpaʊər plænt/",
    "status": "new"
  },
  {
    "id": "oxford-1554",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Transformer",
    "answer": "Máy biến thế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /trænsˈfɔːrmər/",
    "status": "new"
  },
  {
    "id": "oxford-1555",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Heat",
    "answer": "Sưởi ấm, làm nóng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /hiːt/",
    "status": "new"
  },
  {
    "id": "oxford-1556",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Natural gas",
    "answer": "Khí tự nhiên",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈnætʃərəl ɡæs/",
    "status": "new"
  },
  {
    "id": "oxford-1557",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Diesel",
    "answer": "Dầu đi-ê-zen",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdiːzəl/",
    "status": "new"
  },
  {
    "id": "oxford-1558",
    "category": "english",
    "subCategory": "Năng lượng",
    "question": "Solar power",
    "answer": "Năng lượng mặt trời",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsoʊlər ˈpaʊər/",
    "status": "new"
  },
  {
    "id": "oxford-1559",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Dancer",
    "answer": "Vũ công",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdæn.sər/",
    "status": "new"
  },
  {
    "id": "oxford-1560",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Designer",
    "answer": "Nhà thiết kế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈzaɪ.nər/",
    "status": "new"
  },
  {
    "id": "oxford-1561",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Magician",
    "answer": "Nhà ảo thuật",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /məˈdʒɪʃ.ən/",
    "status": "new"
  },
  {
    "id": "oxford-1562",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Tour guide",
    "answer": "Hướng dẫn viên du lịch",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /tʊr ɡaɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1563",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Sailor",
    "answer": "Thủy thủ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈseɪ.lər/",
    "status": "new"
  },
  {
    "id": "oxford-1564",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Commentator",
    "answer": "Bình luận viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒm.ənˌteɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1565",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Dentist",
    "answer": "Nha sĩ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɛn.tɪst/",
    "status": "new"
  },
  {
    "id": "oxford-1566",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Postman",
    "answer": "Người đưa thư",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpoʊst.mæn/",
    "status": "new"
  },
  {
    "id": "oxford-1567",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Writer",
    "answer": "Nhà văn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈraɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1568",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Pilot",
    "answer": "Phi công",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpaɪ.lət/",
    "status": "new"
  },
  {
    "id": "oxford-1569",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Plumber",
    "answer": "Thợ sửa chữa ống nước",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈplʌm.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1570",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Tailor",
    "answer": "Thợ may",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈteɪ.lər/",
    "status": "new"
  },
  {
    "id": "oxford-1571",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Copywriter",
    "answer": "Người viết bài (quảng cáo)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɒp.iˌraɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1572",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Journalist",
    "answer": "Nhà báo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒɜː.nə.lɪst/",
    "status": "new"
  },
  {
    "id": "oxford-1573",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Grocer",
    "answer": "Người bán tạp hóa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡroʊ.sər/",
    "status": "new"
  },
  {
    "id": "oxford-1574",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Clerk",
    "answer": "Người thư ký",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /klɜrk/",
    "status": "new"
  },
  {
    "id": "oxford-1575",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Assistant",
    "answer": "Trợ lý",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈsɪs.tənt/",
    "status": "new"
  },
  {
    "id": "oxford-1576",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Model",
    "answer": "Người mẫu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɒd.əl/",
    "status": "new"
  },
  {
    "id": "oxford-1577",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Freelancer",
    "answer": "Người làm việc tự do",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfriːˌlænsər/",
    "status": "new"
  },
  {
    "id": "oxford-1578",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Consultant",
    "answer": "Chuyên viên tư vấn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kənˈsʌl.tənt/",
    "status": "new"
  },
  {
    "id": "oxford-1579",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Self-employed",
    "answer": "Tự làm chủ",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌsɛlfɪmˈplɔɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1580",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Supervisor",
    "answer": "Giám sát viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsuː.pərˌvaɪ.zər/",
    "status": "new"
  },
  {
    "id": "oxford-1581",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Sales manager",
    "answer": "Giám đốc kinh doanh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /seɪlz ˈmæn.ɪ.dʒər/",
    "status": "new"
  },
  {
    "id": "oxford-1582",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Production manager",
    "answer": "Giám đốc sản xuất",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /prəˈdʌk.ʃən ˈmæn.ɪ.dʒər/",
    "status": "new"
  },
  {
    "id": "oxford-1583",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Mechanic",
    "answer": "Thợ cơ khí",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /məˈkæn.ɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1584",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Managing director",
    "answer": "Giám đốc điều hành",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmæn.ɪ.dʒɪŋ dɪˈrɛktər/",
    "status": "new"
  },
  {
    "id": "oxford-1585",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Personal assistant",
    "answer": "Trợ lý riêng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈpɜː.sən.əl əˈsɪs.tənt/",
    "status": "new"
  },
  {
    "id": "oxford-1586",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Hairdresser",
    "answer": "Thợ cắt tóc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɛərˌdrɛs.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1587",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Architect",
    "answer": "Kiến trúc sư",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɑːrkɪˌtɛkt/",
    "status": "new"
  },
  {
    "id": "oxford-1588",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Engineer",
    "answer": "Kỹ sư",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌɛn.dʒɪˈnɪər/",
    "status": "new"
  },
  {
    "id": "oxford-1589",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Vet",
    "answer": "Bác sĩ thú y",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /vɛt/",
    "status": "new"
  },
  {
    "id": "oxford-1590",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Shoemaker",
    "answer": "Thợ đóng giày",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʃuːˌmeɪ.kər/",
    "status": "new"
  },
  {
    "id": "oxford-1591",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Translator",
    "answer": "Biên dịch viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /trænzˈleɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1592",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Interpreter",
    "answer": "Phiên dịch viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪnˈtɜː.prɪ.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1593",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Sanitation worker",
    "answer": "Lao công",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌsænɪˈteɪ.ʃən ˈwɜːrkər/",
    "status": "new"
  },
  {
    "id": "oxford-1594",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Business manager",
    "answer": "Giám đốc kinh doanh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbɪznɪs ˈmæn.ɪ.dʒər/",
    "status": "new"
  },
  {
    "id": "oxford-1595",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Police officer",
    "answer": "Cảnh sát",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /pəˈliːs ˈɒfɪ.sər/",
    "status": "new"
  },
  {
    "id": "oxford-1596",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Personnel manager",
    "answer": "Giám đốc nhân sự",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˌpɜːrsəˈnɛl ˈmæn.ɪ.dʒər/",
    "status": "new"
  },
  {
    "id": "oxford-1597",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Teacher",
    "answer": "Giáo viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtiː.tʃər/",
    "status": "new"
  },
  {
    "id": "oxford-1598",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Doctor",
    "answer": "Bác sĩ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɒk.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1599",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Nurse",
    "answer": "Y tá",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /nɜrs/",
    "status": "new"
  },
  {
    "id": "oxford-1600",
    "category": "english",
    "subCategory": "Nghề nghiệp",
    "question": "Farmer",
    "answer": "Nông dân",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɑː.mər/",
    "status": "new"
  },
  {
    "id": "oxford-1601",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Keep-fit",
    "answer": "Thể dục",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kiːp-fɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1602",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Regular",
    "answer": "Thường xuyên",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈrɛɡ.jʊ.lər/",
    "status": "new"
  },
  {
    "id": "oxford-1603",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Diabetes",
    "answer": "Bệnh tiểu đường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌdaɪəˈbiːtiːz/",
    "status": "new"
  },
  {
    "id": "oxford-1604",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Dietitian",
    "answer": "Chuyên gia về dinh dưỡng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌdaɪɪˈtɪʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1605",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Goiter",
    "answer": "Bướu cổ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɡɔɪtər/",
    "status": "new"
  },
  {
    "id": "oxford-1606",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Body",
    "answer": "Cơ thể",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbɒdi/",
    "status": "new"
  },
  {
    "id": "oxford-1607",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Thin",
    "answer": "Gầy, ốm",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /θɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1608",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Dietary",
    "answer": "(thuộc) chế độ ăn uống",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈdaɪəˌtɛri/",
    "status": "new"
  },
  {
    "id": "oxford-1609",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Fat",
    "answer": "Mập",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /fæt/",
    "status": "new"
  },
  {
    "id": "oxford-1610",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Overweight",
    "answer": "Béo, thừa cân",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌoʊvərˈweɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1611",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Eating disorder",
    "answer": "Rối loạn ăn uống",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈiːtɪŋ dɪsˈɔːrdər/",
    "status": "new"
  },
  {
    "id": "oxford-1612",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Nutrient",
    "answer": "Chất dinh dưỡng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈnuːtriənt/",
    "status": "new"
  },
  {
    "id": "oxford-1613",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Ingredient",
    "answer": "Thành phần, nguyên liệu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪnˈɡriːdiənt/",
    "status": "new"
  },
  {
    "id": "oxford-1614",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Allergy",
    "answer": "Dị ứng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈælədʒi/",
    "status": "new"
  },
  {
    "id": "oxford-1615",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Vitamin",
    "answer": "Vi-ta-min",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈvaɪtəmɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1616",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Overeat",
    "answer": "Ăn quá nhiều",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˌoʊvərˈiːt/",
    "status": "new"
  },
  {
    "id": "oxford-1617",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Nutritious",
    "answer": "Bổ dưỡng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /njuˈtrɪʃəs/",
    "status": "new"
  },
  {
    "id": "oxford-1618",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Vegetarian",
    "answer": "Người ăn chay",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌvɛdʒɪˈtɛəriən/",
    "status": "new"
  },
  {
    "id": "oxford-1619",
    "category": "english",
    "subCategory": "Chế độ ăn uống",
    "question": "Mineral",
    "answer": "Khoáng chất",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɪnərəl/",
    "status": "new"
  },
  {
    "id": "oxford-1620",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Earthquake",
    "answer": "Động đất",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɜːrθˌkweɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1621",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Aftershock",
    "answer": "Dư chấn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈæftərˌʃɒk/",
    "status": "new"
  },
  {
    "id": "oxford-1622",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Flood",
    "answer": "Lũ lụt",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /flʌd/",
    "status": "new"
  },
  {
    "id": "oxford-1623",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Drought",
    "answer": "Hạn hán",
    "example": "Từ loại: Danh từ (n) | Phiên âm: draʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1624",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Famine",
    "answer": "Nạn đói",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfæmɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1625",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Avalanche",
    "answer": "Tuyết lở",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈævəˌlæntʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1626",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Blizzard",
    "answer": "Bão tuyết",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈblɪzərd/",
    "status": "new"
  },
  {
    "id": "oxford-1627",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Tornado",
    "answer": "Lốc xoáy",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tɔrˈneɪdoʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1628",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Forest fire",
    "answer": "Cháy rừng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈfɔːrɪst ˌfaɪər/",
    "status": "new"
  },
  {
    "id": "oxford-1629",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Hurricane",
    "answer": "Bão",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈhɜːrɪˌkeɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1630",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Storm",
    "answer": "Bão",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /stɔːrm/",
    "status": "new"
  },
  {
    "id": "oxford-1631",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Evacuation",
    "answer": "Sự sơ tán",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪˌvækjuˈeɪʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1632",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Evacuate",
    "answer": "Sơ tán",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ɪˈvækjuˌeɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1633",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Catastrophic",
    "answer": "Thảm khốc",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌkætəˈstrɒfɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1634",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Nationwide",
    "answer": "Toàn quốc",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌneɪʃənˈwaɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1635",
    "category": "english",
    "subCategory": "Thảm họa thiên nhiên",
    "question": "Precaution",
    "answer": "Sự phòng ngừa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /prɪˈkɔːʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1636",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Avenue",
    "answer": "Đại lộ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈævəˌnjuː/",
    "status": "new"
  },
  {
    "id": "oxford-1637",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Between",
    "answer": "Ở giữa",
    "example": "Từ loại: pre | Phiên âm: /bɪˈtwiːn/",
    "status": "new"
  },
  {
    "id": "oxford-1638",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Beside",
    "answer": "Bên cạnh",
    "example": "Từ loại: pre | Phiên âm: bɪˈsaɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1639",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Behind",
    "answer": "Ở phía sau",
    "example": "Từ loại: pre | Phiên âm: /bɪˈhaɪnd/",
    "status": "new"
  },
  {
    "id": "oxford-1640",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Curve",
    "answer": "Uốn cong",
    "example": "Từ loại: Động từ (v) | Phiên âm: /kɜːrv/",
    "status": "new"
  },
  {
    "id": "oxford-1641",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "In front of",
    "answer": "(vị trí) ở phía trước, ở đằng trước",
    "example": "Từ loại: pre | Phiên âm: /ɪn frʌnt əv/",
    "status": "new"
  },
  {
    "id": "oxford-1642",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Opposite",
    "answer": "Trước mặt, đối diện",
    "example": "Từ loại: pre | Phiên âm: /ˈɒpəzɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1643",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Near",
    "answer": "Gần",
    "example": "Từ loại: pre | Phiên âm: /nɪər/",
    "status": "new"
  },
  {
    "id": "oxford-1644",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Turn right",
    "answer": "Rẽ phải",
    "example": "Từ loại: Cụm động từ | Phiên âm: /tɜrn raɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1645",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Turn left",
    "answer": "Rẽ trái",
    "example": "Từ loại: Cụm động từ | Phiên âm: /tɜrn lɛft/",
    "status": "new"
  },
  {
    "id": "oxford-1646",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Junction",
    "answer": "Giao lộ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdʒʌŋkʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1647",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Turning",
    "answer": "Ngã rẽ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtɜrnɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1648",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Roundabout",
    "answer": "Bùng binh",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈraʊndəˌbaʊt/",
    "status": "new"
  },
  {
    "id": "oxford-1649",
    "category": "english",
    "subCategory": "Chỉ đường",
    "question": "Pavement",
    "answer": "Vỉa hè",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpeɪvmənt/",
    "status": "new"
  },
  {
    "id": "oxford-1650",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Bar",
    "answer": "Quầy bán rượu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɑːr/",
    "status": "new"
  },
  {
    "id": "oxford-1651",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Chef",
    "answer": "Đầu bếp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʃɛf/",
    "status": "new"
  },
  {
    "id": "oxford-1652",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Waiter",
    "answer": "Người hầu bàn (nam)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈweɪtər/",
    "status": "new"
  },
  {
    "id": "oxford-1653",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Waitress",
    "answer": "Người hầu bàn (nữ)",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈweɪtrəs/",
    "status": "new"
  },
  {
    "id": "oxford-1654",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Bill",
    "answer": "Hóa đơn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1655",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Service",
    "answer": "Dịch vụ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɜːr.vɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1656",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Tip",
    "answer": "Tiền boa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tɪp/",
    "status": "new"
  },
  {
    "id": "oxford-1657",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Knife",
    "answer": "Dao",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /naɪf/",
    "status": "new"
  },
  {
    "id": "oxford-1658",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Bowl",
    "answer": "Bát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /boʊl/",
    "status": "new"
  },
  {
    "id": "oxford-1659",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Teapot",
    "answer": "Bình trà",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtiːˌpɒt/",
    "status": "new"
  },
  {
    "id": "oxford-1660",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Glass",
    "answer": "Ly",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡlæs/",
    "status": "new"
  },
  {
    "id": "oxford-1661",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Breakfast",
    "answer": "Bữa ăn sáng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbrɛk.fəst/",
    "status": "new"
  },
  {
    "id": "oxford-1662",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Dinner",
    "answer": "Bữa ăn tối",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɪn.ər/",
    "status": "new"
  },
  {
    "id": "oxford-1663",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Lunch",
    "answer": "Bữa ăn trưa",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /lʌntʃ/",
    "status": "new"
  },
  {
    "id": "oxford-1664",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Booking office",
    "answer": "Phòng bán vé",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbʊkɪŋ ˈɒfɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1665",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Menu",
    "answer": "Thực đơn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈmɛnjuː/",
    "status": "new"
  },
  {
    "id": "oxford-1666",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Starter",
    "answer": "Món khai vị",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈstɑːr.tər/",
    "status": "new"
  },
  {
    "id": "oxford-1667",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Main course",
    "answer": "Món chính",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /meɪn kɔːrs/",
    "status": "new"
  },
  {
    "id": "oxford-1668",
    "category": "english",
    "subCategory": "Phòng khách sạn",
    "question": "Dessert",
    "answer": "Món tráng miệng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /dɪˈzɜːrt/",
    "status": "new"
  },
  {
    "id": "oxford-1669",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Advanced",
    "answer": "Tiên tiến",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ədˈvænst/",
    "status": "new"
  },
  {
    "id": "oxford-1670",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Equip",
    "answer": "Trang bị",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ɪˈkwɪp/",
    "status": "new"
  },
  {
    "id": "oxford-1671",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Express mail",
    "answer": "Thư chuyển phát nhanh",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ɪkˈsprɛs meɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1672",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Graphic",
    "answer": "Thuộc đồ họa",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈɡræfɪk/",
    "status": "new"
  },
  {
    "id": "oxford-1673",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Messenger Call Service",
    "answer": "Dịch vụ Điện thoại",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈmɛsɪndʒər kɔːl ˈsɜːrvɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1674",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Notify",
    "answer": "Thông báo",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈnoʊtɪˌfaɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1675",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Parcel",
    "answer": "Bưu kiện, bưu phẩm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɑːrsəl/",
    "status": "new"
  },
  {
    "id": "oxford-1676",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Press",
    "answer": "Báo chí",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /prɛs/",
    "status": "new"
  },
  {
    "id": "oxford-1677",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Receive",
    "answer": "Nhận",
    "example": "Từ loại: Động từ (v) | Phiên âm: /rɪˈsiːv/",
    "status": "new"
  },
  {
    "id": "oxford-1678",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Recipient",
    "answer": "Người nhận",
    "example": "Từ loại: Danh từ (n) | Phiên âm: rɪˈsɪpiənt/",
    "status": "new"
  },
  {
    "id": "oxford-1679",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Secure",
    "answer": "(cảm giác) yên tâm, an toàn",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /sɪˈkjʊr/",
    "status": "new"
  },
  {
    "id": "oxford-1680",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Service",
    "answer": "Dịch vụ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɜːrvɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1681",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Spacious",
    "answer": "Rộng rãi",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈspeɪʃəs/",
    "status": "new"
  },
  {
    "id": "oxford-1682",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Speedy",
    "answer": "Nhanh chóng",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈspiːdi/",
    "status": "new"
  },
  {
    "id": "oxford-1683",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Staff",
    "answer": "Nhân viên",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /stæf/",
    "status": "new"
  },
  {
    "id": "oxford-1684",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Subscribe",
    "answer": "Đặt mua",
    "example": "Từ loại: Động từ (v) | Phiên âm: /səbˈskraɪb/",
    "status": "new"
  },
  {
    "id": "oxford-1685",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Surface mail",
    "answer": "Thư gửi bằng đường bộ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsɜːrfɪs meɪl/",
    "status": "new"
  },
  {
    "id": "oxford-1686",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Technology",
    "answer": "Công nghệ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /tɛkˈnɒlədʒi/",
    "status": "new"
  },
  {
    "id": "oxford-1687",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Thoughtful",
    "answer": "Ân cần, chu đáo",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈθɔːtfəl/",
    "status": "new"
  },
  {
    "id": "oxford-1688",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Transfer",
    "answer": "Chuyển",
    "example": "Từ loại: Động từ (v) | Phiên âm: /trænsˈfɜːr/",
    "status": "new"
  },
  {
    "id": "oxford-1689",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Transmit",
    "answer": "Truyền",
    "example": "Từ loại: Động từ (v) | Phiên âm: /trænzˈmɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1690",
    "category": "english",
    "subCategory": "Bưu điện",
    "question": "Well-trained",
    "answer": "Được đào tạo bài bản",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /wɛl treɪnd/",
    "status": "new"
  },
  {
    "id": "oxford-1691",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Staff movements",
    "answer": "Luân chuyển nhân sự",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /stæf ˈmuːvmənts/",
    "status": "new"
  },
  {
    "id": "oxford-1692",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Retire",
    "answer": "Nghỉ hưu",
    "example": "Từ loại: Động từ (v) | Phiên âm: /rɪˈtaɪər/",
    "status": "new"
  },
  {
    "id": "oxford-1693",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Dismiss",
    "answer": "Sa thải",
    "example": "Từ loại: Động từ (v) | Phiên âm: /dɪsˈmɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1694",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Finance",
    "answer": "Tài chính",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfaɪnæns/",
    "status": "new"
  },
  {
    "id": "oxford-1695",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Appointment",
    "answer": "Sự bổ nhiệm",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈpɔɪntmənt/",
    "status": "new"
  },
  {
    "id": "oxford-1696",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Multinational",
    "answer": "Đa quốc gia",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˌmʌltɪˈnæʃənəl/",
    "status": "new"
  },
  {
    "id": "oxford-1697",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Investor",
    "answer": "Nhà đầu tư",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪnˈvɛstər/",
    "status": "new"
  },
  {
    "id": "oxford-1698",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Inherit",
    "answer": "Thừa kế",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ɪnˈhɛrɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1699",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Accountant",
    "answer": "Nhân viên kế toán",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /əˈkaʊntənt/",
    "status": "new"
  },
  {
    "id": "oxford-1700",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Lend",
    "answer": "Cho vay",
    "example": "Từ loại: Động từ (v) | Phiên âm: /lɛnd/",
    "status": "new"
  },
  {
    "id": "oxford-1701",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Borrow",
    "answer": "Vay, mượn",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈbɒroʊ/",
    "status": "new"
  },
  {
    "id": "oxford-1702",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Rent",
    "answer": "Thuê",
    "example": "Từ loại: Động từ (v) | Phiên âm: /rɛnt/",
    "status": "new"
  },
  {
    "id": "oxford-1703",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Distribution",
    "answer": "Sự phân phối, phân phát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌdɪstrɪˈbjuːʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1704",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Co-ordinate",
    "answer": "Phối hợp, sắp xếp",
    "example": "Từ loại: Động từ (v) | Phiên âm: /koʊˈɔrdəˌneɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1705",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Purchase",
    "answer": "Mua",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈpɜrʧəs/",
    "status": "new"
  },
  {
    "id": "oxford-1706",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Stock exchange",
    "answer": "Sàn giao dịch chứng khoán",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /stɒk ɪksˈʧeɪndʒ/",
    "status": "new"
  },
  {
    "id": "oxford-1707",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Stock market",
    "answer": "Thị trường chứng khoán",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /stɒk ˈmɑrkɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1708",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Opportunity",
    "answer": "Cơ hội",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌɒpərˈtunɪti/",
    "status": "new"
  },
  {
    "id": "oxford-1709",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Challenge",
    "answer": "Thử thách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈʧæləndʒ/",
    "status": "new"
  },
  {
    "id": "oxford-1710",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Career",
    "answer": "Nghề nghiệp, sự nghiệp",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kəˈrɪər/",
    "status": "new"
  },
  {
    "id": "oxford-1711",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Intensive course",
    "answer": "Khóa học cấp tốc",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ɪnˈtɛnsɪv kɔrs/",
    "status": "new"
  },
  {
    "id": "oxford-1712",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Commerce",
    "answer": "Thương mại",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈkɑːmɜrs/",
    "status": "new"
  },
  {
    "id": "oxford-1713",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Costly",
    "answer": "Tốn kém",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈkɒstli/",
    "status": "new"
  },
  {
    "id": "oxford-1714",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Responsible",
    "answer": "Chịu trách nhiệm",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /rɪˈspɒnsəbl/",
    "status": "new"
  },
  {
    "id": "oxford-1715",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Communicate",
    "answer": "Giao tiếp",
    "example": "Từ loại: Động từ (v) | Phiên âm: /kəˈmjuːnɪˌkeɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1716",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Abroad",
    "answer": "Ở nước ngoài",
    "example": "Từ loại: Trạng từ (adv) | Phiên âm: /əˈbrɔd/",
    "status": "new"
  },
  {
    "id": "oxford-1717",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Inheritance",
    "answer": "Sự thừa kế",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪnˈhɛrɪtəns/",
    "status": "new"
  },
  {
    "id": "oxford-1718",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Fortune",
    "answer": "Tài sản, vận may",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈfɔrʧən/",
    "status": "new"
  },
  {
    "id": "oxford-1719",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Property",
    "answer": "Tài sản",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈprɒpərti/",
    "status": "new"
  },
  {
    "id": "oxford-1720",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Cash machine",
    "answer": "Máy rút tiền",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /kæʃ məˈʃiːn/",
    "status": "new"
  },
  {
    "id": "oxford-1721",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Online account",
    "answer": "Tài khoản trực tuyến",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈɒnˌlaɪn əˈkaʊnt/",
    "status": "new"
  },
  {
    "id": "oxford-1722",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Insurance policy",
    "answer": "Hợp đồng bảo hiểm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ɪnˈʃʊrəns ˈpɒlɪsi/",
    "status": "new"
  },
  {
    "id": "oxford-1723",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Credit card",
    "answer": "Thẻ tín dụng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkrɛdɪt kɑrd/",
    "status": "new"
  },
  {
    "id": "oxford-1724",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Debit card",
    "answer": "Thẻ ghi nợ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈdɛbɪt kɑrd/",
    "status": "new"
  },
  {
    "id": "oxford-1725",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Rental contract",
    "answer": "Hợp đồng cho thuê",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈrɛntəl ˈkɒntrækt/",
    "status": "new"
  },
  {
    "id": "oxford-1726",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Discount",
    "answer": "Sự giảm giá, chiết khấu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈdɪskaʊnt/",
    "status": "new"
  },
  {
    "id": "oxford-1727",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Credit limit",
    "answer": "Hạn mức tín dụng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈkrɛdɪt ˈlɪmɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1728",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Survey",
    "answer": "Khảo sát",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈsɜːrveɪ/",
    "status": "new"
  },
  {
    "id": "oxford-1729",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Possession",
    "answer": "Sự sở hữu",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /pəˈzɛʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1730",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Equality",
    "answer": "Sự ngang bằng nhau",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪˈkwɒlɪti/",
    "status": "new"
  },
  {
    "id": "oxford-1731",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Poverty",
    "answer": "Sự nghèo",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈpɒvərti/",
    "status": "new"
  },
  {
    "id": "oxford-1732",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Charge",
    "answer": "Phí, tiền phải trả",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ʧɑrdʒ/",
    "status": "new"
  },
  {
    "id": "oxford-1733",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Outsource",
    "answer": "Thuê ngoài",
    "example": "Từ loại: Động từ (v) | Phiên âm: /ˈaʊtsɔrs/",
    "status": "new"
  },
  {
    "id": "oxford-1734",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Grant",
    "answer": "Trợ cấp, công nhận",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɡrænt/",
    "status": "new"
  },
  {
    "id": "oxford-1735",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Warehouse",
    "answer": "Kho hàng",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈwɛrˌhaʊs/",
    "status": "new"
  },
  {
    "id": "oxford-1736",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Lease",
    "answer": "Cho thuê",
    "example": "Từ loại: Động từ (v) | Phiên âm: /liːs/",
    "status": "new"
  },
  {
    "id": "oxford-1737",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "In-house",
    "answer": "Tiến hành trong một tổ chức",
    "example": "Từ loại: Tính từ (adj) | Phiên âm: /ˈɪnhaʊs/",
    "status": "new"
  },
  {
    "id": "oxford-1738",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Potential",
    "answer": "Tiềm lực , tiềm tàng",
    "example": "Từ loại: adj/ n | Phiên âm: /pəˈtɛnʃəl/",
    "status": "new"
  },
  {
    "id": "oxford-1739",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Back-office",
    "answer": "Văn phòng hành chính",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /bæk ˈɒfɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1740",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Campaign",
    "answer": "Chiến dịch",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /kæmˈpeɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1741",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Insecurity",
    "answer": "Tính ko an toàn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌɪnsɪˈkjʊrɪti/",
    "status": "new"
  },
  {
    "id": "oxford-1742",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Insurance provider",
    "answer": "Nhà cung cấp bảo hiểm",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ɪnˈʃʊrəns prəˈvaɪdər/",
    "status": "new"
  },
  {
    "id": "oxford-1743",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Compensation",
    "answer": "Sự đền bù, bồi thường",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˌkɒmpənˈseɪʃən/",
    "status": "new"
  },
  {
    "id": "oxford-1744",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Commit",
    "answer": "Cam kết",
    "example": "Từ loại: Động từ (v) | Phiên âm: /kəˈmɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1745",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Short-term cost",
    "answer": "Chi phí ngắn hạn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈʃɔrtˌtɜrm kɒst/",
    "status": "new"
  },
  {
    "id": "oxford-1746",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Long-term gain",
    "answer": "Tiền kiếm được dài hạn",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈlɒŋˌtɜrm ɡeɪn/",
    "status": "new"
  },
  {
    "id": "oxford-1747",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Expense",
    "answer": "Phí tổn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ɪkˈspɛns/",
    "status": "new"
  },
  {
    "id": "oxford-1748",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Invoice",
    "answer": "Hóa đơn",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈɪnvɔɪs/",
    "status": "new"
  },
  {
    "id": "oxford-1749",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Bribery",
    "answer": "Sự đút lót, hối lộ",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbraɪbəri/",
    "status": "new"
  },
  {
    "id": "oxford-1750",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Corrupt",
    "answer": "Tham nhũng",
    "example": "Từ loại: Động từ (v) | Phiên âm: /kəˈrʌpt/",
    "status": "new"
  },
  {
    "id": "oxford-1751",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Balance of payment",
    "answer": "Cán cân thanh toán quốc tế",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbælɪns əv ˈpeɪmənt/",
    "status": "new"
  },
  {
    "id": "oxford-1752",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Balance of trade",
    "answer": "Cán cân thương mại",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈbælɪns əv treɪd/",
    "status": "new"
  },
  {
    "id": "oxford-1753",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Budget",
    "answer": "Ngân sách",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈbʌdʒɪt/",
    "status": "new"
  },
  {
    "id": "oxford-1754",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Cost of borrowing",
    "answer": "Chi phí vay",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /kɒst əv ˈbɒroʊɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1755",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Consumer price index",
    "answer": "Chỉ số giá tiêu dùng",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /kənˈsumər praɪs ˈɪndɛks/",
    "status": "new"
  },
  {
    "id": "oxford-1756",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Retail banking",
    "answer": "Ngân hàng bán lẻ",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈriːteɪl ˈbæŋkɪŋ/",
    "status": "new"
  },
  {
    "id": "oxford-1757",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Commercial bank",
    "answer": "Ngân hàng thương mại",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /kəˈmɜrʃəl bæŋk/",
    "status": "new"
  },
  {
    "id": "oxford-1758",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Central bank",
    "answer": "Ngân hàng trung ương",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ˈsɛntrəl bæŋk/",
    "status": "new"
  },
  {
    "id": "oxford-1759",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Treasury",
    "answer": "Kho bạc",
    "example": "Từ loại: Danh từ (n) | Phiên âm: /ˈtrɛʒəri/",
    "status": "new"
  },
  {
    "id": "oxford-1760",
    "category": "english",
    "subCategory": "Ngân hàng",
    "question": "Investment bank",
    "answer": "Ngân hàng đầu tư",
    "example": "Từ loại: Cụm danh từ | Phiên âm: /ɪnˈvɛstmənt bæŋk/",
    "status": "new"
  },
  {
    "id": "python-1",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách viết comment (ghi chú) trong Python?",
    "answer": "Dùng ký tự thăng # cho ghi chú trên một dòng hoặc chuỗi ba dấu nháy kép \"\"\" cho ghi chú nhiều dòng (docstring).",
    "example": "# Đây là comment dòng đơn\n\"\"\"\nĐây là comment\nnhiều dòng\n\"\"\"",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-2",
    "category": "programming",
    "subCategory": "Python",
    "question": "Quy tắc đặt tên biến hợp lệ trong Python?",
    "answer": "Chỉ chứa chữ cái, chữ số và dấu gạch dưới _. Tên biến phải bắt đầu bằng chữ hoặc _ (không bắt đầu bằng số), phân biệt hoa thường và không trùng từ khóa của ngôn ngữ.",
    "example": "valid_name = 10\n_private_var = \"ok\"\n# 2invalid = 5 (lỗi cú pháp)",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-3",
    "category": "programming",
    "subCategory": "Python",
    "question": "Các hàm chuyển đổi kiểu dữ liệu cơ bản (Type Conversion)?",
    "answer": "int(x) chuyển sang số nguyên, float(x) chuyển số thực, str(x) chuyển chuỗi, và bool(x) chuyển sang logic.",
    "example": "int(\"123\") * 2 # 246\nfloat(5) # 5.0\nbool(1) # True",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-4",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cú pháp rẽ nhánh điều kiện if...elif...else?",
    "answer": "Dùng để thực thi các khối mã khác nhau dựa trên điều kiện. Chú ý thụt lề (indentation) và dấu hai chấm (:) ở cuối mỗi điều kiện.",
    "example": "if age < 5:\n    price = 5\nelif age < 16:\n    price = 10\nelse:\n    price = 18",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-5",
    "category": "programming",
    "subCategory": "Python",
    "question": "Hàm range(n) tạo ra chuỗi số như thế nào trong vòng lặp for?",
    "answer": "Tạo chuỗi n số nguyên bắt đầu từ 0 đến n-1. Cú pháp đầy đủ: range(begin, end, step).",
    "example": "for i in range(5): # lặp 0, 1, 2, 3, 4\n    print(i)",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-6",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách hoạt động của vòng lặp while?",
    "answer": "Thực thi liên tục khối mã bên trong khi điều kiện còn True. Cần thay đổi điều kiện trong thân lặp để tránh lặp vô hạn.",
    "example": "counter = 0\nwhile counter < 5:\n    print(counter)\n    counter += 1",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-7",
    "category": "programming",
    "subCategory": "Python",
    "question": "Sự khác nhau giữa break và continue trong vòng lặp?",
    "answer": "break dừng và thoát hoàn toàn vòng lặp ngay lập tức. continue bỏ qua các câu lệnh còn lại trong lần lặp hiện tại và chuyển sang lần lặp kế tiếp.",
    "example": "for i in range(10):\n    if i == 3: break # Thoát\n    if i % 2 == 0: continue # Bỏ qua số chẵn",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-8",
    "category": "programming",
    "subCategory": "Python",
    "question": "Ý nghĩa của câu lệnh pass trong Python?",
    "answer": "Là một câu lệnh rỗng (placeholder) không thực hiện hành động nào, dùng khi cú pháp yêu cầu có mã lệnh nhưng chưa muốn viết.",
    "example": "def my_func():\n    pass # Sẽ viết code sau",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-9",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách khai báo tham số mặc định (default parameters) cho hàm?",
    "answer": "Gán giá trị mặc định trực tiếp trong định nghĩa hàm. Nếu lúc gọi hàm không truyền tham số đó thì giá trị mặc định sẽ được dùng.",
    "example": "def greet(name=\"Student\"):\n    print(\"Hello \" + name)\ngreet() # Hello Student",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-10",
    "category": "programming",
    "subCategory": "Python",
    "question": "Hàm đệ quy (recursive function) là gì và lưu ý quan trọng?",
    "answer": "Là hàm tự gọi lại chính nó. Cần phải có một điều kiện dừng (base case) để tránh lặp vô hạn và lỗi tràn bộ nhớ (stack overflow).",
    "example": "def factorial(n):\n    if n == 0: return 1\n    return n * factorial(n - 1)",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-11",
    "category": "programming",
    "subCategory": "Python",
    "question": "Điểm khác biệt lớn nhất giữa Tuple và List?",
    "answer": "List dùng ngoặc vuông [], là kiểu dữ liệu có thể thay đổi (mutable). Tuple dùng ngoặc tròn (), là kiểu không thể thay đổi sau khi tạo (immutable).",
    "example": "my_list = [1, 2]\nmy_list[0] = 9 # OK\nmy_tuple = (1, 2)\n# my_tuple[0] = 9 (Lỗi TypeError)",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-12",
    "category": "programming",
    "subCategory": "Python",
    "question": "Kiểu dữ liệu Dictionary lưu trữ dữ liệu như thế nào?",
    "answer": "Lưu trữ dưới dạng cặp Khóa - Giá trị (Key-Value), cho phép tìm kiếm nhanh qua các khóa. Khai báo bằng dấu ngoặc nhọn {}.",
    "example": "student = {\"name\": \"Harry\", \"house\": \"Gryffindor\"}\nprint(student[\"name\"]) # Harry",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-13",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cú pháp cắt lát (Slicing) một danh sách trong Python?",
    "answer": "Cú pháp: list[start:end:step] để trích xuất một phần danh sách từ chỉ số start đến end - 1 với bước nhảy step.",
    "example": "lst = [10, 20, 30, 40, 50]\nprint(lst[0:3]) # [10, 20, 30]\nprint(lst[::-1]) # Đảo ngược: [50, 40, 30, 20, 10]",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-14",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách khai báo và duyệt qua danh sách đa chiều (ma trận)?",
    "answer": "Danh sách đa chiều là danh sách chứa các danh sách con. Duyệt qua bằng 2 vòng lặp for lồng nhau.",
    "example": "matrix = [[1, 2], [3, 4]]\nfor row in matrix:\n    for val in row:\n        print(val)",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-15",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách mở ghi và đọc file văn bản (text file) cơ bản?",
    "answer": "Dùng open(file, mode, encoding). Mode 'w' để ghi mới (ghi đè), 'a' để ghi nối đuôi, và 'r' để đọc file. Cần gọi .close() sau khi dùng.",
    "example": "f = open(\"data.txt\", \"w\", encoding=\"utf-8\")\nf.write(\"Hello\")\nf.close()",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-16",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách chuyển đổi chuỗi JSON sang đối tượng Python và ngược lại?",
    "answer": "Sử dụng module json. Hàm json.loads(string) chuyển chuỗi JSON thành Dict. Hàm json.dumps(dict) chuyển Dict thành chuỗi JSON.",
    "example": "import json\ndata = json.loads('{\"name\": \"Harry\"}')\njs = json.dumps(data)",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-17",
    "category": "programming",
    "subCategory": "Python",
    "question": "Các bước cơ bản để vẽ biểu đồ đường bằng thư viện Matplotlib?",
    "answer": "Import matplotlib.pyplot, truyền dữ liệu vào hàm plot(), thiết lập tiêu đề, nhãn trục và gọi show() để hiển thị.",
    "example": "import matplotlib.pyplot as plt\nplt.plot([1, 2], [3, 4])\nplt.title(\"Line Plot\")\nplt.show()",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-18",
    "category": "programming",
    "subCategory": "Python",
    "question": "Ý nghĩa của hàm __init__ và tham số self trong Class?",
    "answer": "__init__ là constructor (hàm khởi tạo) dùng để gán giá trị thuộc tính ban đầu khi tạo đối tượng. self đại diện cho chính thực thể (object) đang gọi hàm.",
    "example": "class Student:\n    def __init__(self, name):\n        self.name = name\nstd = Student(\"Harry\")",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-19",
    "category": "programming",
    "subCategory": "Python",
    "question": "Phương thức dunder __str__ trong Class có vai trò gì?",
    "answer": "Định nghĩa chuỗi đại diện (string representation) thân thiện cho đối tượng, tự động gọi khi dùng hàm print(obj) hoặc str(obj).",
    "example": "class Student:\n    def __str__(self):\n        return f\"Học sinh: {self.name}\"",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-20",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách kiểm soát truy cập và kiểm tra hợp lệ thuộc tính bằng @property?",
    "answer": "Dùng decorator @property làm Getter để đọc thuộc tính ẩn, và @property_name.setter làm Setter để kiểm tra dữ liệu trước khi gán.",
    "example": "class Student:\n    @property\n    def age(self): return self._age\n    @age.setter\n    def age(self, val):\n        if val < 0: raise ValueError()\n        self._age = val",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-21",
    "category": "programming",
    "subCategory": "Python",
    "question": "Cách kế thừa thuộc tính của Class cha thông qua hàm super()?",
    "answer": "Lớp con khai báo kế thừa trong ngoặc tròn Child(Parent). Dùng super().__init__(...) trong hàm khởi tạo của lớp con để chạy hàm khởi tạo của lớp cha.",
    "example": "class Wizard:\n    def __init__(self, name): self.name = name\nclass Student(Wizard):\n    def __init__(self, name, house):\n        super().__init__(name)\n        self.house = house",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "python-22",
    "category": "programming",
    "subCategory": "Python",
    "question": "Nạp chồng toán tử (Operator Overloading) là gì và phương thức dunder cộng?",
    "answer": "Cho phép định nghĩa lại cách hoạt động của các toán tử (+, -, ==...) trên đối tượng tự tạo. Dùng __add__(self, other) để định nghĩa toán tử +.",
    "example": "class Point:\n    def __init__(self, x): self.x = x\n    def __add__(self, other):\n        return Point(self.x + other.x)",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-1",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Thuật toán (Algorithm) là gì?",
    "answer": "Là một tập hợp các hướng dẫn từng bước (step-by-step) rõ ràng, được sắp xếp theo một thứ tự xác định nhằm hoàn thành một công việc hoặc giải quyết một vấn đề cụ thể.",
    "example": "Ví dụ: Các bước giải phương trình bậc nhất ax + b = 0:\n1. Nhập a và b\n2. Nếu a = 0:\n   - Nếu b = 0: vô số nghiệm\n   - Nếu b != 0: vô nghiệm\n3. Nếu a != 0: nghiệm x = -b/a\n4. Kết thúc và in kết quả.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-2",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Ý nghĩa của các hình dạng cơ bản trong Lưu đồ (Flowchart)?",
    "answer": "Hình thoi: Điều kiện rẽ nhánh (Decision)\nHình bình hành: Nhập/Xuất dữ liệu (Input/Output)\nHình chữ nhật: Thực hiện phép toán/tiến trình (Process)\nHình oval dẹt: Bắt đầu/Kết thúc (Terminal)",
    "example": "Quy ước tiêu chuẩn quốc tế giúp các lập trình viên dễ dàng đọc hiểu thuật toán của nhau mà không bị phụ thuộc vào ngôn ngữ lập trình.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-3",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Ba cấu trúc điều khiển cơ bản trong Lưu đồ và Thuật toán?",
    "answer": "1. Tuần tự (Sequential): Đi từ trên xuống dưới theo thứ tự.\n2. Rẽ nhánh (Branching): Lựa chọn hướng đi theo điều kiện đúng/sai.\n3. Vòng lặp (Loop): Lặp lại một hoặc nhiều câu lệnh khi điều kiện còn đúng.",
    "example": "Mọi thuật toán phức tạp trên thế giới đều có thể biểu diễn chỉ bằng sự kết hợp của 3 cấu trúc điều khiển cơ bản này.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-4",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Bốn chức năng hoạt động chính của một hệ thống máy tính?",
    "answer": "1. Nhập dữ liệu (Input): Thu thập dữ liệu từ người dùng hoặc thiết bị.\n2. Xử lý (Process): Biến đổi, tính toán dữ liệu vừa nhập.\n3. Xuất dữ liệu (Output): Hiển thị thông tin kết quả lên màn hình/máy in.\n4. Lưu trữ (Storage): Lưu trữ thông tin lâu dài vào ổ cứng.",
    "example": "Ví dụ: Khi gõ phím (Input), CPU tính toán chữ viết (Process), hiển thị lên màn hình (Output) và nhấn Ctrl+S để lưu lại (Storage).",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-5",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt Máy chủ lớn (Mainframe), Siêu máy tính (Supercomputer) và Máy tính nhúng (Embedded computer)?",
    "answer": "Mainframe: Xử lý lượng giao dịch khổng lồ cực nhanh và an toàn (như hệ thống ngân hàng).\nSupercomputer: Giải quyết các phép toán siêu phức tạp, giả lập khoa học (như dự báo thời tiết).\nEmbedded computer: Đặt gọn trong một thiết bị lớn hơn để thực hiện một nhiệm vụ chuyên biệt (như điều hòa, máy giặt).",
    "example": "Embedded computer thường có kích thước rất nhỏ, tiêu thụ điện năng cực thấp và hệ điều hành tối giản.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-6",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt vai trò của RAM, ROM và CPU trên Bo mạch chủ (Motherboard)?",
    "answer": "CPU: Bộ não xử lý tất cả các câu lệnh và điều khiển mọi linh kiện máy tính.\nRAM: Bộ nhớ tạm thời lưu dữ liệu các chương trình đang chạy, sẽ mất sạch dữ liệu khi mất điện.\nROM: Bộ nhớ chỉ đọc lưu mã khởi động máy tính (BIOS/UEFI), không bị mất dữ liệu khi tắt máy.",
    "example": "Khi chơi game, dữ liệu game từ ổ cứng được nạp vào RAM để CPU xử lý nhanh hơn vì tốc độ đọc ghi của RAM vượt trội so với ổ cứng.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-7",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Sự khác biệt cơ bản giữa máy in phun (Inkjet) và máy in laser?",
    "answer": "Máy in phun: Dùng mực lỏng phun thành giọt, giá máy rẻ, thích hợp in ảnh màu chất lượng cao.\nMáy in laser: Dùng tia laser và bột mực khô, in nhanh, chi phí mỗi trang rẻ, thích hợp in văn bản văn phòng số lượng lớn.",
    "example": "Hộp mực máy in phun dễ bị khô nếu lâu ngày không sử dụng, trong khi hộp mực máy in laser có thể lưu trữ lâu hơn không sợ hỏng.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-8",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt Băng thông (Bandwidth) và Thông lượng (Throughput) trong mạng máy tính?",
    "answer": "Băng thông (Bandwidth): Tốc độ truyền tải lý thuyết tối đa của một kênh truyền mạng.\nThông lượng (Throughput): Tốc độ truyền tải thực tế đo được tại một thời điểm cụ thể (thường thấp hơn băng thông).",
    "example": "Băng thông giống như chiều rộng của đường cao tốc, còn thông lượng giống như số lượng xe thực tế có thể lưu thông trên đường.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-9",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt mạng PAN, LAN, MAN, WAN dựa trên khoảng cách địa lý?",
    "answer": "PAN: Mạng cá nhân (vài mét, như kết nối tai nghe Bluetooth).\nLAN: Mạng cục bộ (trong nhà, văn phòng, trường học).\nMAN: Mạng đô thị (kết nối các chi nhánh trong phạm vi một thành phố).\nWAN: Mạng diện rộng (phạm vi quốc gia hoặc toàn cầu, lớn nhất là Internet).",
    "example": "Các máy tính trong cùng một phòng học được nối mạng LAN để chia sẻ máy in và trao đổi tài liệu nội bộ.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-10",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Sự khác biệt về vai trò giữa Switch (Bộ chuyển mạch) và Router (Bộ định tuyến)?",
    "answer": "Switch: Kết nối nhiều thiết bị trong cùng một mạng LAN để chúng giao tiếp trực tiếp với nhau thông qua địa chỉ MAC.\nRouter: Kết nối các mạng máy tính khác nhau và định tuyến gói tin đi qua các mạng thông qua địa chỉ IP.",
    "example": "Trong nhà bạn, Switch kết nối máy tính và tivi với nhau, còn Router kết nối toàn bộ hệ thống nhà bạn ra mạng Internet bên ngoài.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-11",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt kiến trúc mạng Client/Server và Peer-to-Peer (P2P)?",
    "answer": "Client/Server: Có một máy chủ trung tâm lưu trữ tài nguyên và quản lý bảo mật, các máy khách kết nối vào để lấy dữ liệu.\nPeer-to-Peer (P2P): Không có máy chủ trung tâm, các máy tính (peers) giao tiếp trực tiếp với nhau và có vai trò ngang nhau.",
    "example": "Mạng tải file Torrent là ví dụ điển hình của P2P. Trình duyệt web đọc báo trực tuyến là ví dụ của Client/Server.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-12",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Hệ điều hành (OS) là gì và nhiệm vụ chính của nó?",
    "answer": "Là phần mềm hệ thống điều phối hoạt động giữa phần cứng và các ứng dụng, cung cấp giao diện cho người dùng tương tác.",
    "example": "Ví dụ: Windows, macOS, Linux, Android, iOS. Nhiệm vụ chính: Quản lý bộ nhớ, tiến trình, hệ thống file và kết nối mạng.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-13",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Điểm khác biệt giữa chế độ Sleep (Ngủ) và Hibernate (Ngủ đông)?",
    "answer": "Sleep: Lưu trạng thái làm việc vào RAM và đưa CPU vào trạng thái tiêu thụ điện cực thấp. Khởi động lại cực nhanh.\nHibernate: Lưu toàn bộ dữ liệu RAM vào ổ cứng (HDD/SSD) rồi tắt nguồn hoàn toàn. Khởi động lâu hơn Sleep nhưng không tốn tí điện nào.",
    "example": "Nếu máy tính sắp hết pin và bạn không mang sạc, nên dùng Hibernate thay vì Sleep để lưu trữ dữ liệu an toàn.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-14",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt phần mềm hệ thống (System Software) và phần mềm ứng dụng (Application Software)?",
    "answer": "Phần mềm hệ thống: Làm nền tảng giúp máy tính vận hành ổn định và quản lý phần cứng (như Hệ điều hành, driver, trình diệt virus).\nPhần mềm ứng dụng: Giúp người dùng thực hiện một công việc cụ thể (như Word, Chrome, Photoshop, Excel).",
    "example": "Không có phần mềm ứng dụng máy tính vẫn hoạt động được, nhưng không có phần mềm hệ thống máy tính chỉ là đống sắt vụn.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-15",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Bốn thành phần cấu tạo nên một câu lệnh Prompt hiệu quả trong AI?",
    "answer": "1. Chỉ thị (Instruction): Yêu cầu AI làm gì.\n2. Ngữ cảnh (Context): Cung cấp thông tin nền/vai trò.\n3. Dữ liệu đầu vào (Input Data): Văn bản/Dữ liệu cần xử lý.\n4. Định dạng đầu ra (Output Indicator): Kiểu định dạng trả về (bảng, danh sách, code).",
    "example": "Ví dụ: 'Hãy dịch bài viết này (Instruction) sang tiếng Việt lịch sự (Context). Văn bản: [đoạn văn] (Input Data). Đầu ra dạng Markdown (Output).'",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-16",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt Zero-shot prompting và Few-shot prompting?",
    "answer": "Zero-shot: Ra lệnh trực tiếp cho AI thực hiện tác vụ mà không đưa ra ví dụ mẫu nào.\nFew-shot: Cung cấp cho AI một vài ví dụ mẫu trước khi đặt câu hỏi chính thức để định hướng cách trả lời.",
    "example": "Few-shot giúp AI học theo khuôn mẫu và định dạng chính xác mà bạn mong muốn cho các câu trả lời phức tạp.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-17",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Kỹ thuật gợi ý theo chuỗi suy nghĩ (Chain-of-Thought - CoT) là gì?",
    "answer": "Là kỹ thuật viết prompt yêu cầu AI phải giải thích và giải quyết bài toán từng bước một (step-by-step) trước khi đưa ra kết quả cuối cùng.",
    "example": "CoT giúp nâng cao đáng kể độ chính xác của AI khi thực hiện các bài toán số học hoặc lập luận logic phức tạp.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-18",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Tội phạm mạng (Cybercrime) và Trộm cắp danh tính (Identity theft) là gì?",
    "answer": "Tội phạm mạng là các hành vi phạm pháp sử dụng máy tính làm công cụ chính. Trộm cắp danh tính là việc đánh cắp thông tin cá nhân để giả mạo nạn nhân nhằm trục lợi tài chính.",
    "example": "Ví dụ: Giả mạo thẻ tín dụng, thay đổi địa chỉ nhận thư, tự ý mở thẻ ngân hàng dưới tên người khác.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-19",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt Hacker mũ trắng, mũ đen và mũ xám?",
    "answer": "Mũ trắng (White-hat): Hack hợp pháp để tìm lỗi và sửa bảo mật;\nMũ đen (Black-hat): Hack bất hợp pháp để phá hoại, đánh cắp dữ liệu;\nMũ xám (Grey-hat): Hack không phép để tìm lỗi nhưng không có mục đích xấu (thường báo lỗi để xin thưởng).",
    "example": "White-hat hacker còn được gọi là Ethical Hacker (hacker đạo đức), thường được các công ty lớn thuê để bảo vệ hệ thống.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-20",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt mã độc Trojan và chương trình cửa sau (Backdoor)?",
    "answer": "Trojan giả vờ là phần mềm hữu ích để lừa người dùng tải về nhưng chứa mã độc phá hoại bên trong.\nBackdoor là công cụ/đoạn code tạo lối đi bí mật giúp hacker truy cập hệ thống từ xa mà không cần đăng nhập hợp lệ.",
    "example": "Tải game lậu từ nguồn không rõ ràng dễ bị đính kèm Trojan để mở cổng Backdoor cho hacker kiểm soát máy tính.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-21",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Máy tính Zombie và mạng Botnet trong an ninh mạng là gì?",
    "answer": "Zombie: Máy tính bị hacker kiểm soát bí mật thông qua phần mềm độc hại mà người dùng không hề hay biết.\nBotnet: Mạng lưới gồm hàng ngàn/triệu máy tính Zombie phối hợp với nhau để thực hiện các cuộc tấn công lớn.",
    "example": "Hacker sử dụng mạng Botnet để gửi thư rác hàng loạt hoặc thực hiện các cuộc tấn công từ chối dịch vụ (DDoS).",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-22",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Tấn công Từ chối dịch vụ (DoS) và Từ chối dịch vụ phân tán (DDoS) là gì?",
    "answer": "DoS: Cuộc tấn công áp đảo một máy chủ bằng lượng yêu cầu khổng lồ từ 1 nguồn duy nhất để làm nó sập/quá tải.\nDDoS: Phiên bản phân tán, sử dụng hàng ngàn nguồn (mạng Botnet) tấn công cùng lúc khiến việc ngăn chặn cực kỳ khó khăn.",
    "example": "Làm tràn ngập băng thông hoặc quá tải tài nguyên hệ thống khiến người dùng thật không thể truy cập dịch vụ.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-23",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Tường lửa (Firewall) bảo vệ máy tính bằng những cơ chế nào?",
    "answer": "1. Lọc gói tin (Packet filtering): Loại bỏ gói tin đáng ngờ.\n2. Chặn cổng logic (Logical port blocking): Ngăn truy cập trái phép qua các cổng.\n3. Biên dịch địa chỉ mạng (NAT): Ẩn địa chỉ IP nội bộ của bạn với mạng Internet.",
    "example": "Cả hệ điều hành Windows và macOS đều tích hợp sẵn tường lửa phần mềm đáng tin cậy và được bật mặc định.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-24",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Các phương pháp phần mềm diệt virus bảo vệ hệ thống?",
    "answer": "1. Đối chiếu chữ ký virus (Virus signature): Tìm đoạn mã đặc trưng của virus đã biết.\n2. Cách ly (Quarantining): Cô lập file nhiễm độc.\n3. Tiêm chủng (Inoculation): Ghi nhận các thuộc tính file an toàn để giám sát sự thay đổi trái phép.",
    "example": "Norton và Trend Micro là hai phần mềm diệt virus thương mại phổ biến trên thế giới.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-25",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt 3 loại sao lưu (Backup) dữ liệu: Full, Incremental và Image?",
    "answer": "Full: Sao lưu toàn bộ tệp tin hiện có.\nIncremental: Chỉ sao lưu những tệp có thay đổi kể từ lần sao lưu trước đó để tiết kiệm thời gian.\nImage: Sao lưu toàn bộ hệ thống gồm cả hệ điều hành, phần mềm, dữ liệu và cấu hình.",
    "example": "Sao lưu Incremental giúp tiết kiệm dung lượng và thời gian nhất, thường dùng cho sao lưu tự động hàng ngày.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-26",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Ưu và nhược điểm của sao lưu đám mây (Cloud) so với ổ cứng ngoài?",
    "answer": "Đám mây: Truy cập mọi lúc mọi nơi, an toàn trước thiên tai tại nhà nhưng tốn phí duy trì.\nỔ cứng ngoài: Chi phí một lần rẻ, sao lưu nhanh qua cổng USB nhưng dễ bị mất trộm hoặc hỏng vật lý.",
    "example": "Kết hợp cả hai hình thức sao lưu (quy tắc 3-2-1) là phương pháp bảo vệ dữ liệu tối ưu nhất.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-27",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Các phương thức xác thực sinh trắc học (Biometrics) phổ biến?",
    "answer": "Quét dấu vân tay (Fingerprint), nhận diện mống mắt (Iris pattern), nhận diện giọng nói (Voice), và nhận diện khuôn mặt (Face recognition).",
    "example": "Sinh trắc học cung cấp mức độ bảo mật rất cao vì các đặc điểm sinh học của con người là duy nhất và khó giả mạo.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-28",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Thỏa thuận cấp phép người dùng cuối (EULA) quy định điều gì?",
    "answer": "EULA quy định: Quyền sở hữu phần mềm thuộc về nhà phát triển (người dùng chỉ mua quyền sử dụng); Số lượng máy được phép cài đặt; Quyền sao chép; và Điều khoản bảo hành.",
    "example": "Khi cài đặt phần mềm, việc tích chọn 'I accept the license agreement' chính là đồng ý với các điều khoản trong EULA.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-29",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Phân biệt cài đặt cục bộ (Local) và Phần mềm dịch vụ (SaaS)?",
    "answer": "Cài đặt cục bộ: Tải phần mềm về cài trực tiếp lên bộ nhớ máy tính.\nSaaS (Software as a Service): Chạy phần mềm trực tiếp trên đám mây thông qua trình duyệt web và trả phí dạng thuê bao (subscription).",
    "example": "Google Workspace, Office 365 trên nền web, và Canva là các ví dụ điển hình của mô hình dịch vụ SaaS.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-30",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Các ứng dụng thực tế phổ biến của Thị giác máy tính (Computer Vision)?",
    "answer": "Nhận dạng chữ viết (OCR), nhận diện khuôn mặt/nụ cười trên camera, xe tự hành (nhận diện làn đường/chướng ngại vật), định vị robot công nghiệp, và chẩn đoán hình ảnh y tế (chụp MRI, CT).",
    "example": "Computer vision giúp máy tính phân tích và hiểu được nội dung của các hình ảnh và video thu được từ camera.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-31",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Các nguyên tắc quan trọng khi thiết kế Prompt cho AI?",
    "answer": "Khởi đầu đơn giản; Ra chỉ thị rõ ràng; Càng cụ thể càng tốt; Tránh sự mơ hồ; Đưa ra các câu hỏi mở; và Cung cấp ví dụ mẫu nếu tác vụ phức tạp.",
    "example": "Thay vì viết 'Hãy viết email', nên viết 'Hãy đóng vai trưởng phòng viết một email thông báo họp khẩn gọn gàng bằng tiếng Việt'.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  },
  {
    "id": "it-32",
    "category": "programming",
    "subCategory": "Nhập môn CNTT",
    "question": "Hiện tượng ảo giác (Hallucination) của AI là gì và cách phòng tránh?",
    "answer": "Là hiện tượng các mô hình ngôn ngữ lớn (LLM) tự tin đưa ra các thông tin sai lệch, không có thật hoặc bịa đặt hoàn toàn do giới hạn dữ liệu hoặc cấu trúc thuật toán.\nCách phòng tránh: Luôn đối chiếu chéo (cross-checking) kết quả với tài liệu uy tín.",
    "example": "Khi sử dụng AI để học tập hoặc nghiên cứu, người học luôn cần đối chiếu chéo kết quả với các nguồn tài liệu uy tín.",
    "status": "new",
    "repetition": 0,
    "interval": 1,
    "efactor": 2.5,
    "nextReviewDate": 0
  }
];
