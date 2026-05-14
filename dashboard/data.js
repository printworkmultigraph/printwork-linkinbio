/* ============================================
   PRINTWORK — Static Content Data
   Social Media Content Templates
   (Kept for future features)
   ============================================ */

const CONTENT_PILLARS = [
    { id: 'educate', name: '📚 Educate', color: '#0EA5E9', weight: 25, desc: 'Teach about packaging materials, printing processes, design tips' },
    { id: 'showcase', name: '🎨 Showcase', color: '#EC4899', weight: 25, desc: 'Portfolio, before/after, client results' },
    { id: 'promo', name: '🔥 Promo', color: '#EF4444', weight: 20, desc: 'Deals, bundles, limited offers, flash sale' },
    { id: 'engage', name: '💬 Engage', color: '#F59E0B', weight: 15, desc: 'Polls, Q&A, testimonials, UGC' },
    { id: 'behind', name: '🏭 Behind the Scenes', color: '#84CC16', weight: 15, desc: 'Factory tour, production process, team' }
];

const PRODUCTS = [
    { id: 'standing-pouch', name: 'Standing Pouch', emoji: '🧴' },
    { id: 'box', name: 'Box/Dus Custom', emoji: '📦' },
    { id: 'sticker', name: 'Sticker/Label', emoji: '🏷️' },
    { id: 'paper-cup', name: 'Paper Cup', emoji: '☕' },
    { id: 'wrapping', name: 'Wrapping Paper', emoji: '🎁' },
    { id: 'totebag', name: 'Totebag', emoji: '👜' },
    { id: 'other', name: 'Lainnya', emoji: '📋' }
];

const CAPTION_TEMPLATES = {
    educate: {
        professional: [
            "Tahukah Anda bahwa {product} premium bisa meningkatkan perceived value produk Anda hingga 40%? 📈\n\nDi Printwork, kami menggunakan teknologi cetak terbaru untuk memastikan warna tetap vibrant dan tahan lama.\n\n✨ Material food-grade certified\n✨ Minimum order terjangkau\n✨ Free konsultasi desain",
            "Tips memilih {product} yang tepat untuk brand Anda:\n\n1️⃣ Sesuaikan material dengan produk\n2️⃣ Pastikan desain mencerminkan brand identity\n3️⃣ Pertimbangkan user experience saat unboxing\n\n💡 Konsultasi GRATIS dengan tim desain kami!"
        ],
        casual: [
            "Psst... mau tau rahasia kenapa brand-brand hits packaging-nya selalu cakep? 👀\n\nJawabannya: {product} custom yang didesain khusus!\n\nDi Printwork, kita bantu dari A-Z:\n✅ Desain\n✅ Cetak\n✅ Kirim\n\nGampang banget kan? 😎",
            "Bingung pilih {product}? Sini kita bantu! 🤗\n\nTinggal bilang:\n📌 Produk apa yang mau di-pack\n📌 Budget berapa\n📌 Mau style gimana\n\nSisanya serahin ke Printwork! 💪"
        ]
    },
    showcase: {
        professional: [
            "✨ Project Highlight: {product} Custom\n\nClient: [Brand Name]\nMaterial: Premium grade\nFinishing: Matte lamination + spot UV\n\nHasil yang clean, premium, dan tentunya bikin produk makin standout di rak! 🏆\n\n📩 DM untuk konsultasi project Anda",
            "Fresh from production! 🏭\n\n{product} custom ini baru selesai dan kami sangat puas dengan hasilnya.\n\n🎨 Full color printing\n📐 Presisi cutting\n💎 Premium finishing\n\nMau hasil seperti ini? Let's talk! 📱"
        ],
        casual: [
            "Cek hasil terbaru dari dapur Printwork! 🔥\n\n{product} ini requested sama client yang super detail — dan hasilnya? *chef's kiss* 👨‍🍳\n\nKalian mau yang kayak gini juga? Langsung aja chat kita ya! 💬",
            "POV: Packaging kamu setelah di-upgrade sama Printwork 😍\n\n{product} custom ini proof bahwa packaging bagus itu investasi, bukan expense!\n\nSetuju nggak? 🤔\n\n#PrintworkID #CustomPackaging"
        ]
    },
    promo: {
        professional: [
            "🔥 SPECIAL OFFER — {product}\n\nDapatkan DISKON hingga 20% untuk pemesanan {product} minggu ini!\n\n✅ Gratis konsultasi desain\n✅ Gratis revisi 3x\n✅ Pengiriman express available\n\n⏰ Promo berlaku sampai akhir minggu!\n📩 DM atau klik link di bio",
            "💼 Business Bundle Deal!\n\nPesan {product} + 1 produk lainnya dan dapatkan:\n🎁 Potongan 15%\n🎁 Free sample\n🎁 Priority production\n\nLimited slots — first come, first served!\n\n📱 Chat via WhatsApp: link di bio"
        ],
        casual: [
            "🚨 FLASH SALE ALERT! 🚨\n\n{product} custom lagi DISKON GEDE nih! Cuma sampe akhir minggu!\n\nBuruan sebelum slot penuh ya! 🏃‍♂️💨\n\n📱 Chat langsung: link di bio\n\n#Promo #FlashSale #PrintworkID",
            "Yuk manfaatin promo {product} dari Printwork! 🤑\n\n🎉 Diskon up to 20%\n🎉 Free desain\n🎉 Ongkir subsidi\n\nKapan lagi coba? Langsung chat aja! 💬"
        ]
    },
    engage: {
        professional: [
            "Packaging mana yang menurut Anda paling menarik?\n\nA. Minimalist clean\nB. Bold & colorful\nC. Rustic natural\nD. Luxury premium\n\nShare pendapat Anda di kolom komentar! 👇\n\nApapun style yang Anda pilih, Printwork bisa wujudkan ✨",
            "Q&A Time! 💡\n\nPertanyaan yang sering ditanyakan tentang {product}:\n\n❓ Minimum order berapa?\n❓ Berapa lama proses produksi?\n❓ Bisa request desain custom?\n\nJawaban: YES untuk semuanya! 🎉\n\nAda pertanyaan lain? Drop di komentar 👇"
        ],
        casual: [
            "Vote dong! 🗳️\n\nKalian tim packaging mana nih?\n\n🤍 Minimalis\n🖤 Bold\n🤎 Natural\n💛 Luxury\n\nComment di bawah ya! Paling banyak dipilih bakal kita bikinin contoh 👀",
            "Coba tebak {product} ini buat brand apa? 🤔\n\nClue:\n🔹 Brand lokal\n🔹 Produk F&B\n🔹 Based di Jakarta\n\nYang bener dapet DISKON 10%! 🎉\n\nJawab di komentar 👇"
        ]
    },
    behind: {
        professional: [
            "🏭 Behind the Scenes: Proses produksi {product}\n\nTahap 1: Design finalization\nTahap 2: Plate making\nTahap 3: Printing\nTahap 4: Finishing & QC\nTahap 5: Packaging & delivery\n\nSetiap tahap dikerjakan dengan standar quality control ketat untuk memastikan hasil terbaik.\n\n📩 Order sekarang!",
            "Meet the team! 👋\n\nDi balik setiap {product} yang sempurna, ada tim profesional yang bekerja keras:\n\n🎨 Design team\n🖨️ Production team\n📋 QC team\n📦 Logistics team\n\nThank you team Printwork! 💪"
        ],
        casual: [
            "Mau liat gimana {product} kalian dibuat? 👀\n\nIni behind the scenes dari pabrik Printwork!\n\n🎬 Proses cetak → laminating → cutting → QC → packing\n\nSemua dikerjain sama tim expert kita. Keren kan? 🔥\n\nYuk order: link di bio!",
            "Day in the life di Printwork! 📸\n\nPagi: Finalisasi desain ✏️\nSiang: Masuk produksi 🖨️\nSore: Quality check ✅\nMalem: Siap kirim! 📦\n\nNon-stop untuk kasih yang terbaik buat kalian! 💪"
        ]
    }
};

const CTA_TEMPLATES = [
    "📩 DM untuk info lebih lanjut",
    "📱 Chat WhatsApp: link di bio",
    "🛒 Order di Tokopedia: link di bio",
    "💬 Konsultasi GRATIS — chat sekarang!",
    "📋 Download pricelist: link di bio",
    "🔗 Klik link di bio untuk order",
    "📞 Hubungi CS kami untuk penawaran terbaik"
];

const HASHTAG_SETS = {
    brand: ['#PrintworkID', '#Printwork', '#PrintworkPackaging'],
    product: ['#CustomPackaging', '#PackagingCustom', '#KemasanCustom', '#PackagingDesign'],
    industry: ['#PackagingIndonesia', '#UMKM', '#BrandLokal', '#BisnisOnline'],
    material: ['#StandingPouch', '#BoxCustom', '#StickerLabel', '#PaperCup'],
    vibe: ['#PremiumPackaging', '#PackagingKeren', '#DesainPackaging', '#PackagingMurah'],
    location: ['#PackagingJakarta', '#CetakPackaging', '#PercetakanJakarta'],
    trending: ['#SmallBusiness', '#Entrepreneur', '#BrandIdentity', '#PackagingMatters'],
    engagement: ['#TipsPackaging', '#PackagingTips', '#BelajarBisnis', '#InspirasiBisnis']
};

const CONTENT_IDEAS = {
    reel: [
        "Transformation: before/after packaging upgrade",
        "Proses cetak dari awal sampai akhir (timelapse)",
        "Unboxing produk client",
        "ASMR printing process",
        "Quick tips memilih material packaging",
        "Packing order hari ini!",
        "3 kesalahan packaging yang bikin brand terlihat murahan",
        "Packaging trends 2026"
    ],
    carousel: [
        "5 alasan packaging custom penting untuk brand Anda",
        "Panduan lengkap memilih standing pouch",
        "Portfolio showcase: 10 project terbaik bulan ini",
        "Cara menghitung budget packaging untuk UMKM",
        "Material comparison: art paper vs kraft vs plastik",
        "Step-by-step order di Printwork",
        "Inspirasi desain packaging by industry",
        "FAQ: Jawaban semua pertanyaan tentang cetak packaging"
    ],
    story: [
        "Daily poll: packaging style favorit",
        "This or that: matte vs glossy",
        "Behind the scenes hari ini",
        "Client testimonial highlight",
        "Countdown promo spesial",
        "Q&A box: tanya tentang packaging",
        "Quick tip of the day",
        "Flash sale announcement"
    ],
    feed: [
        "Product highlight single image",
        "Flat lay packaging collection",
        "Quote tentang branding & packaging",
        "Client spotlight & testimonial",
        "New product announcement",
        "Team photo / culture post",
        "Infographic: packaging statistics",
        "Holiday / seasonal greeting",
        "Milestone celebration"
    ]
};

const WEEKLY_SCHEDULE = [
    { day: 'Senin', pillar: 'educate', format: 'carousel', time: '10:00', desc: 'Educational content — tips & knowledge' },
    { day: 'Selasa', pillar: 'showcase', format: 'reel', time: '12:00', desc: 'Portfolio showcase — video/reel' },
    { day: 'Rabu', pillar: 'engage', format: 'story', time: '14:00', desc: 'Engagement — polls, Q&A' },
    { day: 'Kamis', pillar: 'behind', format: 'reel', time: '10:00', desc: 'Behind the scenes — production process' },
    { day: 'Jumat', pillar: 'promo', format: 'feed', time: '11:00', desc: 'Promotional content — deals & offers' },
    { day: 'Sabtu', pillar: 'showcase', format: 'carousel', time: '10:00', desc: 'Client results & case studies' },
    { day: 'Minggu', pillar: 'engage', format: 'story', time: '15:00', desc: 'Light engagement — fun content' }
];

// Export for potential future use
if (typeof window !== 'undefined') {
    window.PRINTWORK_DATA = {
        CONTENT_PILLARS,
        PRODUCTS,
        CAPTION_TEMPLATES,
        CTA_TEMPLATES,
        HASHTAG_SETS,
        CONTENT_IDEAS,
        WEEKLY_SCHEDULE
    };
}
