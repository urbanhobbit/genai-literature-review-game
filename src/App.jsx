import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Target, Zap, CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Star, Brain, Search, Filter, Database, BarChart3, FileText, Lightbulb, Globe } from 'lucide-react';

// Stage briefings based on Wagner et al. (2026)
const STAGE_BRIEFINGS = {
  tr: [
    {
      // Problem Formulation
      title: "Problem Tanımlama: GenAI ile Araştırma Fırsatını Keşfetme",
      keyPoints: [
        "GenAI, özetleme, dil çevirisi ve soru-cevap yetenekleriyle problem formülasyonunda güçlü bir destektir.",
        "Önceki inceleme çalışmalarını tespit ederek tekrarlama riskini azaltır ve boşlukları belirlemeye yardımcı olur.",
        "Kavramsal tanımları derleyebilir ve hangi inceleme tipinin uygun olduğuna dair ilk göstergeler sunabilir.",
        "PDF okuma ve RAG (Retrieval-Augmented Generation) yetenekleri, tam metin belgeler üzerinde çalışmayı mümkün kılar."
      ],
      challenges: [
        "GenAI'ın çıktıları her zaman doğrulanmalı - yanılsama (hallucination) riski vardır",
        "İnceleme tipini seçerken metodolojik bilgi gereklidir, GenAI sadece destek sağlar",
        "Açık ve yapılandırılmış promptlar kritiktir - belirsiz sorular yetersiz sonuçlar verir"
      ],
      methods: "Keşifsel promptlama, sıfır-atış promptlama, RAG"
    },
    {
      // Literature Search
      title: "Literatür Arama: Keşiften Sistematik Aramaya",
      keyPoints: [
        "GenAI, keşifsel arama aktivitelerinde güçlüdür - geniş temaları haritalar ve araştırma peyzajını anlar.",
        "Boolean sorgu tasarımında yardımcı olur, özellikle eşanlamlı kelimeleri (statistical synonymy) belirlemede etkilidir.",
        "Consensus, Elicit gibi özel araçlar, RAG ile donatılmış olarak, yanılsamayı azaltır ve ampirik kanıtlara odaklanır.",
        "Dil çeviri yetenekleri, farklı dillerdeki literatürü erişilebilir kılar ve coğrafi önyargıyı azaltır."
      ],
      challenges: [
        "Ücretli içeriklere, yeni yayınlara ve yayınlanmamış çalışmalara erişim sınırlıdır",
        "Açık erişim makalelere odaklanma eğilimi, önemli katkıları kaçırabilir",
        "Yüksek hassasiyet (precision) için kabul edilebilir ama tam geri çağırma (recall) için ek genişletme gerekir"
      ],
      methods: "Az-atış promptlama, RAG, keşifsel promptlama, Boolean sorgu oluşturma"
    },
    {
      // Literature Screening  
      title: "Literatür Eleme: GenAI ile Verimli Filtreleme",
      keyPoints: [
        "GenAI, başlık ve özetlere dayalı sınıflandırmada yardımcı olabilir ancak mükemmel doğruluk henüz garanti değildir.",
        "Lenient (yumuşak) yaklaşım önerilir: Yanlış pozitifler, yanlış negatiflerden daha az zararlıdır.",
        "Çok dilli makaleler için otomatik çeviri, dil engellerini aşar ve önyargıyı azaltır (GROBID + LLM).",
        "İnsan-döngüde yaklaşımı önerilir: GenAI işaretler, insan nihai kararı verir."
      ],
      challenges: [
        "Recall (geri çağırma) henüz yeterince yüksek değil - bazı ilgili makaleler kaçabilir",
        "Veri setleri arasında performans değişkenliği gösterir, genelleştirilebilirlik sınırlıdır",
        "Eleme kriterlerinin açık tanımlanması gerekir, GenAI'ın yoruma bırakılamaz"
      ],
      methods: "Sıfır-atış sınıflandırma, toplu çeviri, yapılandırılmış çıktı (Markdown tablo)"
    },
    {
      // Quality Assessment
      title: "Kalite Değerlendirme: Metodolojik Titizliği Değerlendirme",
      keyPoints: [
        "GenAI, araştırma tasarımı, örneklem büyüklüğü, veri toplama ve istatistiksel yöntemleri çıkarabilir.",
        "Yapılandırılmış promptlar, tutarlı değerlendirme kriterleri sağlar (Markdown tablo formatı ideal).",
        "Şüpheli araştırma uygulamalarını (p-hackleme, HARKing, seçici raporlama) işaretleyebilir.",
        "Paralel bağımsız değerlendirme: GenAI + insan değerlendirmesi karşılaştırılabilir."
      ],
      challenges: [
        "Nüanslı yargılar henüz sınırlıdır - karmaşık metodolojik sorunları tam anlamıyla değerlendiremez",
        "Nihai karar her zaman insan gözetimine bırakılmalıdır",
        "Önceden tanımlanmış kriterler kullanılmalı, GenAI'ın kendi yargısına bırakılamaz"
      ],
      methods: "Sıfır-atış analiz, yapılandırılmış çıktı, az-atış değerlendirme"
    },
    {
      // Data Extraction
      title: "Veri Çıkarma: Yapılandırılmış Bilgiyi Elde Etme",
      keyPoints: [
        "Çok-kipli GenAI (GPT-4o, Claude 3.5 Sonnet), tablolardan veri çıkarmada yüksek doğruluk gösterir.",
        "Yoğunluk zinciri (chain-of-density) promptlaması, yüksek kaliteli özetler oluşturur - insan özetlerini geçer.",
        "Yapılandırılmış çıktı (DataFrame, JSON) veri analizini kolaylaştırır ve doğrulama süreçlerini destekler.",
        "'Dişli sınır' (jagged frontier) kavramı: Bazı görevlerde mükemmel, bazılarında zayıf - öngörülemez."
      ],
      challenges: [
        "Bağlamsal yorum henüz sınırlı - açık karakteristikler iyi, örtük yargılar zayıf",
        "Meta-analiz için korelasyon tablolarını çıkarma umut verici ama henüz tam otomasyon için erken",
        "Her zaman doğrulama gerekli - çıkarılan veriler kontrol edilmeli"
      ],
      methods: "Çok-kipli işleme, yoğunluk zinciri promptlaması, yapılandırılmış veri şemaları"
    },
    {
      // Data Analysis
      title: "Veri Analizi: GenAI ile Kod ve Sentez",
      keyPoints: [
        "Kod üretimi: GenAI, meta-analiz için Python/R kodu yazabilir (forest plot, funnel plot, istatistiksel testler).",
        "Adım-adım talimatlar ve spesifik paket isimleri, çalışan kod üretimini artırır.",
        "Sokratik diyalog: Teori-oluşturma incelemelerinde, GenAI fikir geliştirmeye yardımcı olabilir.",
        "Metin üretimi: Betimleyici özetler, düzenleme ve redaksiyon görevlerinde kullanılabilir."
      ],
      challenges: [
        "Üretilen kod her zaman test edilmeli ve doğrulanmalıdır",
        "Teori-oluşturma, derin insan yorumu gerektirir - GenAI sadece artırır, yerini almaz",
        "Metodoloji kontrolü gereklidir, GenAI'a bırakılamaz"
      ],
      methods: "Sıfır-atış kod üretimi, Sokratik promptlama, düşünce zinciri"
    },
    {
      // Synthesis & Writing
      title: "Sentez ve Yazma: Telif Hakkı ve Şeffaflık",
      keyPoints: [
        "TELİF HAKKI KRİTİKTİR: <15 kelime alıntı, kaynak başına MAKSIMUM 1 alıntı, parafraz varsayılan olmalı.",
        "Yerinden etme riski: Uzun özetler okumayı yerinden etmemeli, kısa ve yüksek-yoğunluklu tercih edilmeli.",
        "Şeffaflık zorunludur: Hangi araçlar, hangi görevler, nasıl doğrulandı, hangi kısıtlamalar açıklanmalı.",
        "Tekrarlanabilirlik: Promptlar, süreçler ve kararlar paylaşılmalıdır."
      ],
      challenges: [
        "Makale yapısını kopyalamaktan kaçının - tamamen yeniden yapılandırın",
        "GenAI kullanımını gizlemek etik ihlaldir",
        "Genel ifadeler yetersizdir - spesifik açıklamalar gerekir"
      ],
      methods: "Parafraz-öncelikli yazma, yapılandırılmış açıklama, tam şeffaflık"
    }
  ],
  en: [
    {
      // Problem Formulation
      title: "Problem Formulation: Discovering Research Opportunities with GenAI",
      keyPoints: [
        "GenAI provides powerful support in problem formulation through summarization, language translation, and question-answering capabilities.",
        "It identifies prior review studies, reducing replication risk and helping identify gaps.",
        "Can compile conceptual definitions and provide initial indications of suitable review types.",
        "PDF reading and RAG (Retrieval-Augmented Generation) capabilities enable working with full-text documents."
      ],
      challenges: [
        "GenAI outputs must always be verified - hallucination risk exists",
        "Selecting review type requires methodological knowledge; GenAI only provides support",
        "Clear and structured prompts are critical - vague questions yield inadequate results"
      ],
      methods: "Exploratory prompting, zero-shot prompting, RAG"
    },
    {
      // Literature Search
      title: "Literature Search: From Exploration to Systematic Search",
      keyPoints: [
        "GenAI excels at exploratory search activities - mapping broad themes and understanding research landscape.",
        "Helps design Boolean queries, particularly effective in identifying statistical synonymy.",
        "Specialized tools like Consensus and Elicit, equipped with RAG, reduce hallucination and focus on empirical evidence.",
        "Language translation capabilities make literature in different languages accessible and reduce geographical bias."
      ],
      challenges: [
        "Access to paywalled content, recent publications, and unpublished work is limited",
        "Tendency to focus on open-access papers may miss important contributions",
        "Acceptable for high precision but requires additional expansion for complete recall"
      ],
      methods: "Few-shot prompting, RAG, exploratory prompting, Boolean query construction"
    },
    {
      // Literature Screening
      title: "Literature Screening: Efficient Filtering with GenAI",
      keyPoints: [
        "GenAI can assist in classification based on titles and abstracts, but perfect accuracy is not yet guaranteed.",
        "Lenient approach is recommended: False positives are less harmful than false negatives.",
        "Automatic translation for multilingual papers overcomes language barriers and reduces bias (GROBID + LLM).",
        "Human-in-the-loop approach recommended: GenAI flags, human makes final decision."
      ],
      challenges: [
        "Recall is not yet sufficiently high - some relevant papers may be missed",
        "Performance varies across datasets, generalizability is limited",
        "Screening criteria must be clearly defined, cannot be left to GenAI's interpretation"
      ],
      methods: "Zero-shot classification, batch translation, structured output (Markdown table)"
    },
    {
      // Quality Assessment
      title: "Quality Assessment: Evaluating Methodological Rigor",
      keyPoints: [
        "GenAI can extract study design, sample size, data collection, and statistical methods.",
        "Structured prompts provide consistent assessment criteria (Markdown table format ideal).",
        "Can flag questionable research practices (p-hacking, HARKing, selective reporting).",
        "Parallel independent assessment: GenAI + human assessment can be compared."
      ],
      challenges: [
        "Nuanced judgments are still limited - cannot fully evaluate complex methodological issues",
        "Final decision must always be left to human oversight",
        "Predefined criteria must be used, cannot be left to GenAI's own judgment"
      ],
      methods: "Zero-shot analysis, structured output, few-shot assessment"
    },
    {
      // Data Extraction
      title: "Data Extraction: Obtaining Structured Information",
      keyPoints: [
        "Multimodal GenAI (GPT-4o, Claude 3.5 Sonnet) shows high accuracy in extracting data from tables.",
        "Chain-of-density prompting produces high-quality summaries - surpasses human summaries.",
        "Structured output (DataFrame, JSON) facilitates data analysis and supports validation processes.",
        "'Jagged frontier' concept: Excellent at some tasks, weak at others - unpredictable."
      ],
      challenges: [
        "Contextual interpretation still limited - good for explicit characteristics, weak for implicit judgments",
        "Extracting correlation tables for meta-analysis is promising but too early for full automation",
        "Verification always needed - extracted data must be checked"
      ],
      methods: "Multimodal processing, chain-of-density prompting, structured data schemas"
    },
    {
      // Data Analysis
      title: "Data Analysis: Code and Synthesis with GenAI",
      keyPoints: [
        "Code generation: GenAI can write Python/R code for meta-analysis (forest plots, funnel plots, statistical tests).",
        "Step-by-step instructions and specific package names increase working code generation.",
        "Socratic dialogue: In theory-building reviews, GenAI can assist in idea development.",
        "Text generation: Can be used for descriptive summaries, editing, and proofreading tasks."
      ],
      challenges: [
        "Generated code must always be tested and verified",
        "Theory-building requires deep human interpretation - GenAI only augments, doesn't replace",
        "Methodology control is necessary, cannot be left to GenAI"
      ],
      methods: "Zero-shot code generation, Socratic prompting, chain-of-thought"
    },
    {
      // Synthesis & Writing
      title: "Synthesis & Writing: Copyright and Transparency",
      keyPoints: [
        "COPYRIGHT IS CRITICAL: <15 words per quote, MAXIMUM 1 quote per source, paraphrase should be default.",
        "Displacement risk: Long summaries shouldn't replace reading, prefer brief and high-density.",
        "Transparency is mandatory: Which tools, which tasks, how validated, what limitations must be disclosed.",
        "Reproducibility: Prompts, processes, and decisions must be shared."
      ],
      challenges: [
        "Avoid copying article structure - completely restructure",
        "Hiding GenAI use is an ethical violation",
        "Generic statements are insufficient - specific disclosures required"
      ],
      methods: "Paraphrase-first writing, structured disclosure, full transparency"
    }
  ]
};

// Translation object
const translations = {
  tr: {
    // Briefing screen
    briefingTitle: "Seviye Bilgilendirme",
    keyPoints: "Temel Noktalar",
    challenges: "Zorluklar ve Kısıtlamalar",
    methods: "Kullanılacak Yöntemler",
    startLevel: "Seviyeyi Başlat",
    basedOnWagner: "Wagner ve ark. (2026) makalesine dayalı",
    
    // Welcome screen
    welcomeTitle: "GenAI Literatür Tarama Oyunu",
    welcomeSubtitle: "Wagner et al. (2026) makalesine dayalı interaktif eğitim deneyimi",
    aboutGame: "Oyun Hakkında",
    levels: "Seviye",
    scenarios: "Senaryo",
    promptStrategies: "Prompt Strategy",
    duration: "Süre",
    startGame: "Oyunu Başlat",
    aboutPoints: [
      "<strong>7 Seviye:</strong> Problem formulation, search, screening, quality assessment, data extraction, analysis, synthesis",
      "<strong>Gerçek Senaryolar:</strong> Her seviyede 2 gerçekçi literatür tarama durumu",
      "<strong>Anında Feedback:</strong> Her cevap için detaylı açıklama ve öğrenme noktaları",
      "<strong>Skill Development:</strong> Prompting strategies, GenAI tools, methodological rigor"
    ],
    
    // Game header
    totalScore: "Toplam Puan",
    progress: "İlerleme",
    scenariosCompleted: "senaryo tamamlandı",
    
    // Stage labels
    stageLabel: "Seviye",
    scenarioLabel: "Senaryo",
    
    // Scenario sections
    situation: "Durum",
    task: "Görev",
    
    // Feedback
    points: "Puan",
    learningPoints: "Öğrenme Noktaları",
    
    // Navigation
    nextScenario: "Sonraki Senaryo",
    nextLevel: "Sonraki Seviye",
    viewResults: "Sonuçları Gör",
    
    // Results screen
    congratulations: "Tebrikler!",
    completedAllLevels: "Tüm seviyeleri tamamladınız",
    successRate: "Başarı",
    performanceByLevel: "Seviye Bazlı Performans",
    keyConceptsLearned: "Öğrenilen Temel Kavramlar",
    promptingStrategies: "Prompting Strategies:",
    methodologicalPrinciples: "Methodological Principles:",
    playAgain: "Tekrar Oyna",
    readPaper: "Makaleyi Oku",
    
    // Grade messages
    gradeA: "Mükemmel! GenAI literatür tarama uzmanısınız!",
    gradeB: "Çok iyi! Güçlü bir temel oluşturdunuz.",
    gradeC: "İyi! Daha fazla pratik ile gelişebilirsiniz.",
    gradeD: "Geçer. Wagner et al. (2026) makalesini tekrar okuyun.",
    gradeF: "Başarısız. Temel kavramları gözden geçirin.",
    
    // Prompting strategies list
    strategies: {
      zeroShot: "Zero-shot prompting",
      fewShot: "Few-shot prompting",
      chainOfThought: "Chain-of-thought",
      rag: "RAG (Retrieval-Augmented Generation)",
      exploratory: "Exploratory prompting"
    },
    
    // Methodological principles list
    principles: {
      systematicity: "Systematicity & transparency",
      humanInLoop: "Human-in-the-loop",
      copyright: "Copyright compliance",
      biasMitigation: "Bias mitigation",
      qualityAssessment: "Quality assessment"
    }
  },
  
  en: {
    // Briefing screen
    briefingTitle: "Level Briefing",
    keyPoints: "Key Points",
    challenges: "Challenges and Limitations",
    methods: "Methods to Use",
    startLevel: "Start Level",
    basedOnWagner: "Based on Wagner et al. (2026)",
    
    // Welcome screen
    welcomeTitle: "GenAI Literature Review Game",
    welcomeSubtitle: "Interactive training experience based on Wagner et al. (2026)",
    aboutGame: "About the Game",
    levels: "Levels",
    scenarios: "Scenarios",
    promptStrategies: "Prompt Strategies",
    duration: "Duration",
    startGame: "Start Game",
    aboutPoints: [
      "<strong>7 Levels:</strong> Problem formulation, search, screening, quality assessment, data extraction, analysis, synthesis",
      "<strong>Real Scenarios:</strong> 2 realistic literature review situations per level",
      "<strong>Instant Feedback:</strong> Detailed explanation and learning points for each answer",
      "<strong>Skill Development:</strong> Prompting strategies, GenAI tools, methodological rigor"
    ],
    
    // Game header
    totalScore: "Total Score",
    progress: "Progress",
    scenariosCompleted: "scenarios completed",
    
    // Stage labels
    stageLabel: "Level",
    scenarioLabel: "Scenario",
    
    // Scenario sections
    situation: "Situation",
    task: "Task",
    
    // Feedback
    points: "Points",
    learningPoints: "Learning Points",
    
    // Navigation
    nextScenario: "Next Scenario",
    nextLevel: "Next Level",
    viewResults: "View Results",
    
    // Results screen
    congratulations: "Congratulations!",
    completedAllLevels: "You've completed all levels",
    successRate: "Success Rate",
    performanceByLevel: "Performance by Level",
    keyConceptsLearned: "Key Concepts Learned",
    promptingStrategies: "Prompting Strategies:",
    methodologicalPrinciples: "Methodological Principles:",
    playAgain: "Play Again",
    readPaper: "Read Paper",
    
    // Grade messages
    gradeA: "Excellent! You're a GenAI literature review expert!",
    gradeB: "Very good! You've built a strong foundation.",
    gradeC: "Good! You can improve with more practice.",
    gradeD: "Pass. Review Wagner et al. (2026) again.",
    gradeF: "Fail. Review the fundamental concepts.",
    
    // Prompting strategies list
    strategies: {
      zeroShot: "Zero-shot prompting",
      fewShot: "Few-shot prompting",
      chainOfThought: "Chain-of-thought",
      rag: "RAG (Retrieval-Augmented Generation)",
      exploratory: "Exploratory prompting"
    },
    
    // Methodological principles list
    principles: {
      systematicity: "Systematicity & transparency",
      humanInLoop: "Human-in-the-loop",
      copyright: "Copyright compliance",
      biasMitigation: "Bias mitigation",
      qualityAssessment: "Quality assessment"
    }
  }
};

// Game stages with bilingual content
const GAME_STAGES = {
  tr: [
    {
      id: 1,
      title: "Problem Tanımlama",
      icon: Lightbulb,
      description: "Araştırma fırsatını belirle ve review tipini seç",
      color: "bg-purple-500",
      scenarios: [
        {
          id: "pf1",
          context: "Dijital dönüşümün örgütsel kültür üzerindeki etkisini araştırmak istiyorsunuz. Konuyla ilgili 15 makale topladınız.",
          task: "GenAI'a hangi promptu verirsiniz?",
          options: [
            {
              text: "Bu makalelerde dijital dönüşüm nasıl tanımlanıyor, örneklerle açıkla?",
              score: 40,
              feedback: "İyi başlangıç ama çok dar kapsamlı. Makalenin Tablo 2'deki gibi daha yapılandırılmış bir veri çıkarma promptu tercih edilmeli."
            },
            {
              text: "PDF'leri yükle, 'dijital dönüşüm' tanımlarını çıkar, alıntı yap veya belirt.",
              score: 100,
              feedback: "Mükemmel! Wagner ve arkadaşlarının Tablo 2'deki sıfır-atış promptlama stratejisini doğru uyguladınız. Sistematik ve doğrulanabilir.",
              isCorrect: true
            },
            {
              text: "Dijital dönüşüm kavramını açıkla ve literatürdeki yeri nedir?",
              score: 10,
              feedback: "Hayır! Bu GenAI'ın genel bilgisini kullanır. Makaleler için Geri-Getirme Destekli Üretim (RAG) gerekli."
            }
          ],
          learningPoints: [
            "Sıfır-atış promptlama: Görevi açık tanımla",
            "PDF yükleme özelliğini kullan (RAG)",
            "Yapılandırılmış çıktı iste (tablo, liste vb.)"
          ]
        },
        {
          id: "pf2",
          context: "Literatürde önceki inceleme çalışmalarını tespit etmek istiyorsunuz. Elinizde 25 PDF var.",
          task: "En uygun promptlama stratejisi hangisi?",
          options: [
            {
              text: "Keşifsel promptlama ile her makalenin atıflarını inceleyerek önceki incelemeleri tespit et.",
              score: 100,
              feedback: "Mükemmel! Tablo 1'deki keşifsel promptlama stratejisini doğru uyguladınız. Açık uçlu soru ile atıf bağlamı analizi.",
              isCorrect: true
            },
            {
              text: "Düşünce zinciri kullanarak önce kaynakçayı oku, kategorize et, sonra da özetle.",
              score: 60,
              feedback: "Düşünce zinciri yararlı olabilir ama bu görev için fazla karmaşık. Keşifsel promptlama daha doğrudan ve etkili."
            },
            {
              text: "Az-atış yaklaşımı ile birkaç inceleme örneği ver ve benzerleri buldurarak tespit et.",
              score: 30,
              feedback: "Az-atış burada gereksiz. Atıf analizi için keşifsel yaklaşım yeterli ve daha hızlı."
            }
          ],
          learningPoints: [
            "Keşifsel promptlama: Açık uçlu sorularla tema keşfi",
            "Atıf bağlamı analizi: Metin içi atıfları incele",
            "Problem tanımlama aşamasında geniş başla"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Literatür Arama",
      icon: Search,
      description: "Arama stratejisi geliştir ve GenAI ile keşfet",
      color: "bg-blue-500",
      scenarios: [
        {
          id: "ls1",
          context: "Büyük dil modellerinin yazılımcı verimliliğine etkisini araştırıyorsunuz. Boolean sorgusu oluşturmak istiyorsunuz.",
          task: "En etkili prompt stratejisi?",
          options: [
            {
              text: "ChatGPT'ye doğrudan sor ve BDM verimlilik için Boolean sorgusu yazdırarak sonucu al.",
              score: 20,
              feedback: "Çok basit. Az-atış promptlama ile örnek vererek daha etkili sonuç alırsınız."
            },
            {
              text: "Az-atış ile bilgi uzmanı rolü ver, örnek göster ve hedef için sorgu oluşturmasını iste.",
              score: 100,
              feedback: "Harika! Tablo 5'teki az-atış stratejisini doğru kullandınız. Örnekle öğretme, rol-tabanlı promptlama ve yapılandırılmış format.",
              isCorrect: true
            },
            {
              text: "Sıfır-atış promptlama ile Web of Science için BDM performans araştırması sorgusu oluştur.",
              score: 50,
              feedback: "İyi ama az-atış daha iyi sonuç verir. Wang ve arkadaşları (2023) bunu kanıtlamış."
            }
          ],
          learningPoints: [
            "Az-atış promptlama: Örnekle öğret",
            "Rol-tabanlı promptlama: 'Bilgi uzmanısınız...'",
            "Boolean sorgu: Yapı taşı yaklaşımı (Yön A VEYA B) VE (Yön C VEYA D)"
          ]
        },
        {
          id: "ls2",
          context: "Elicit veya Consensus gibi özel araçlar kullanarak literatürü keşfetmek istiyorsunuz.",
          task: "RAG-tabanlı keşifsel arama için doğru yaklaşım?",
          options: [
            {
              text: "Genel soru sor: BDM ve verimlilik hakkında GenAI'ın genel bilgisinden yararlanarak cevap al.",
              score: 10,
              feedback: "Hayır! Bu RAG kullanmaz, GenAI'ın genel bilgisine dayanır. Yanılsama riski yüksek."
            },
            {
              text: "Yapılandırılmış sorgu: Değişken-sonuç-bağlam ilişkisi sor, yöntem ve bulgular özetlensin.",
              score: 100,
              feedback: "Mükemmel! Tablo 4'teki RAG stratejisi. Yapılandırılmış soru + spesifik çıktı formatı + ampirik makaleler odağı.",
              isCorrect: true
            },
            {
              text: "Açık uçlu soru: BDM araştırmalarını listele ve genel bir bakış açısıyla değerlendir.",
              score: 30,
              feedback: "Çok geniş. Spesifik araştırma sorusu ile RAG'ın gücünden yararlanın."
            }
          ],
          learningPoints: [
            "RAG: Geri-Getirme Destekli Üretim, yanılsamayı azaltır",
            "Özel araçlar: Consensus, Elicit, Scopus AI",
            "Yapılandırılmış sorular: [değişken] [sonuç]u [bağlam]da nasıl etkiler"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Literatür Eleme",
      icon: Filter,
      description: "Makaleleri ilgililik kriterlerine göre filtrele",
      color: "bg-green-500",
      scenarios: [
        {
          id: "sc1",
          context: "500 makale başlık-özeti var. GenAI ile eleme yapmak istiyorsunuz ama geri çağırma (recall) kritik.",
          task: "Doğru eleme promptu stratejisi?",
          options: [
            {
              text: "Katı yaklaşım: Sadece GenAI ve programcı verimliliği ile doğrudan ilgiliyse dahil et, diğerlerini hariç tut.",
              score: 30,
              feedback: "Hayır! Geri çağırmayı düşürür. Elemede 'yumuşak yaklaşım' önerilir (Tablo 6)."
            },
            {
              text: "Yumuşak yaklaşım: Dahil/hariç karar ver, yanlışlıkla dahil etmeyi hariç tutmaya tercih et.",
              score: 100,
              feedback: "Mükemmel! Syriani ve arkadaşlarının (2024) F2-maksimize eden promptu. Elemede yanlış pozitif, yanlış negatiften daha az zararlı.",
              isCorrect: true
            },
            {
              text: "Dengeli yaklaşım: İlgili olup olmadığına karar ver, hem katı hem yumuşak arasında orta yol izle.",
              score: 50,
              feedback: "Nötr ama makale yumuşak yaklaşımı öneriyor. İlk elemede koruyucu olmak daha iyi."
            }
          ],
          learningPoints: [
            "Eleme prensibi: Yumuşak > Katı (sınır durumlar için)",
            "İki aşamalı eleme: 1) Başlık/Özet 2) Tam metin",
            "GenAI kısıtlamaları: Mükemmel geri çağırma henüz garanti değil"
          ]
        },
        {
          id: "sc2",
          context: "Çok dilli makaleleriniz var (Türkçe, İngilizce, Fransızca). Hepsini elemelisiniz.",
          task: "Dil engelini nasıl aşarsınız?",
          options: [
            {
              text: "Manuel çeviri: Her makaleyi ayrı ayrı insan çevirmenle çevirerek eleme sürecine dahil et.",
              score: 20,
              feedback: "Verimsiz. GenAI'ın çeviri yeteneğini kullanmalısınız."
            },
            {
              text: "GenAI toplu çeviri: Özetleri İngilizceye çevir, Markdown tablo formatında yapılandır ve çıktı al.",
              score: 100,
              feedback: "Harika! Tablo 7'deki strateji. GROBID + BDM ile otomatik çeviri + yapılandırılmış çıktı. Coğrafi önyargıyı azaltır.",
              isCorrect: true
            },
            {
              text: "Sadece İngilizce: Türkçe ve Fransızca makaleleri eleme dışı bırak, yalnızca İngilizce olanları al.",
              score: 0,
              feedback: "Hayır! Van Wee ve Banister (2023): Bu dil önyargısı oluşturur. Önemli bulgular kaçar."
            }
          ],
          learningPoints: [
            "GenAI çeviri: DeepL, GPT-4o, Claude 3.5",
            "GROBID: PDF → TEI/XML dönüşümü",
            "Önyargıdan kaçın: Çok dilli literatürü dahil et"
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Kalite Değerlendirme",
      icon: Target,
      description: "Çalışmaların metodolojik kalitesini değerlendir",
      color: "bg-yellow-500",
      scenarios: [
        {
          id: "qa1",
          context: "Meta-analiz yapıyorsunuz. Her çalışmanın araştırma tasarımı, örneklem büyüklüğü, veri toplama ve istatistiklerini çıkarmalısınız.",
          task: "Kalite değerlendirme için prompt?",
          options: [
            {
              text: "Yapılandırılmamış soru: Bu çalışmanın genel kalitesini değerlendir ve bir yorum yaz.",
              score: 20,
              feedback: "Çok belirsiz. Spesifik metodolojik boyutları belirtmelisiniz."
            },
            {
              text: "Yapılandırılmış prompt: Tasarım, örneklem, veri toplama, analizi belirle ve Markdown tablosu oluştur.",
              score: 100,
              feedback: "Mükemmel! Tablo 8'deki sıfır-atış yaklaşımı. Spesifik boyutlar + yapılandırılmış çıktı. Paralel bağımsız değerlendirme için ideal.",
              isCorrect: true
            },
            {
              text: "GenAI'a bırak: Önemli bulduğun metodolojik özellikleri sen belirle ve raporla.",
              score: 40,
              feedback: "GenAI'ın kendi yargısına bırakmak tutarsızlık yaratır. Önceden tanımlı kriterler kullanın."
            }
          ],
          learningPoints: [
            "Kalite değerlendirme: Araştırma tasarımı, örneklem, yöntemler, istatistikler",
            "Yapılandırılmış çıktı: Markdown tablosu, JSON",
            "Paralel bağımsız değerlendirme: İnsan + GenAI karşılaştırması"
          ]
        },
        {
          id: "qa2",
          context: "Nitel sistematik inceleme yapıyorsunuz. Şüpheli araştırma uygulamalarını (ŞAU) tespit etmek istiyorsunuz.",
          task: "GenAI'ın rolü ne olmalı?",
          options: [
            {
              text: "Tam otomasyon yaklaşımı: Tüm ŞAU'ları tespit et, çalışmaları puanla ve rapor hazırla.",
              score: 30,
              feedback: "Riskli! GenAI mantıksal hataları tespit edebilir ama nihai yargı insan gözetimi gerektirir."
            },
            {
              text: "Artırma yaklaşımı: p-hackleme, HARKing, seçici raporlama işaretle, ben sonra incelerim.",
              score: 100,
              feedback: "Doğru yaklaşım! GenAI yardımcı olur (artırır), karar verici değil. İnsan-döngüde modeli (Habernal ve ark. 2018).",
              isCorrect: true
            },
            {
              text: "Manuel inceleme: GenAI'ı yoksay, tüm çalışmaları baştan sona kendin manuel incele.",
              score: 50,
              feedback: "Tamamen manuel çok yavaş. GenAI işaretleme + insan inceleme kombinasyonu optimal."
            }
          ],
          learningPoints: [
            "ŞAU tespiti: p-hackleme, HARKing, seçici raporlama",
            "İnsan-döngüde: GenAI işaretler, insan karar verir",
            "GenAI kısıtlaması: Nüanslı yargı henüz sınırlı"
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Veri Çıkarma",
      icon: Database,
      description: "Makalelerden yapılandırılmış veri çıkar",
      color: "bg-red-500",
      scenarios: [
        {
          id: "de1",
          context: "Meta-analiz için korelasyon tablolarını çıkarmak istiyorsunuz. 50 çalışma var.",
          task: "Etkili veri çıkarma stratejisi?",
          options: [
            {
              text: "Manuel çıkarma: Her çalışmadaki korelasyon tablolarını tek tek elle çıkar ve kaydet.",
              score: 30,
              feedback: "Çok yavaş. GenAI'ın tablo çıkarma yeteneği var (Tablo 10)."
            },
            {
              text: "GenAI yapılandırılmış çıkarma: Python ile MarkdownDataFrame, görsel çıkarma ve doğrulama yap.",
              score: 100,
              feedback: "Harika! Tablo 10 stratejisi. Görsel → Markdown → DataFrame. GPT-4o 4/5, Claude 3.5 Sonnet 5/5 başarılı.",
              isCorrect: true
            },
            {
              text: "OKT aracı kullan: Tesseract ile tablolardan metin çıkar ve verileri düzenle.",
              score: 50,
              feedback: "OKT yeterli ama GenAI çok-kipli modeller (GPT-4o, Gemini) daha doğru ve bağlam-farkındalı."
            }
          ],
          learningPoints: [
            "Çok-kipli GenAI: Görsel + Metin işleme",
            "Yapılandırılmış çıktı: DataFrame, JSON şema doğrulaması",
            "Dişli sınır: Tablo çıkarma güçlü, ama bağlamsal yorum zayıf"
          ]
        },
        {
          id: "de2",
          context: "Betimleyici inceleme için 100 makaleyi özetlemek istiyorsunuz. Her biri için 3-4 cümlelik özet gerekli.",
          task: "En uygun özetleme stratejisi?",
          options: [
            {
              text: "Basit özetleme: Her makaleyi 3 cümlede özetle ve liste halinde topla.",
              score: 40,
              feedback: "Çalışır ama varlık yoğunluğu düşük. Yoğunluk zinciri daha iyi."
            },
            {
              text: "Yoğunluk zinciri: 5 yineleme, eksik varlıklar ekle, aynı uzunluk, artan yoğunluk sağla.",
              score: 100,
              feedback: "Mükemmel! Tablo 9, Adams ve arkadaşları (2023) stratejisi. Maksimum varlık yoğunluğu, insan özetlerini geçer.",
              isCorrect: true
            },
            {
              text: "Ayrıntılı özetleme: Her makale için kapsamlı 500 kelimelik özet yaz.",
              score: 20,
              feedback: "Hayır! Telif hakkı riski + yerinden etme kaygısı. Kısa, yüksek-yoğunluklu özetler tercih edilmeli."
            }
          ],
          learningPoints: [
            "Yoğunluk zinciri promptlaması: Yinelemeli, artan varlık yoğunluğu",
            "Telif hakkı uyumu: <15 kelime alıntılar, parafraz et",
            "Yerinden etme riski: Özetler okumayı yerinden etmemeli"
          ]
        }
      ]
    },
    {
      id: 6,
      title: "Veri Analizi",
      icon: BarChart3,
      description: "Veriyi analiz et ve sentez yap",
      color: "bg-indigo-500",
      scenarios: [
        {
          id: "da1",
          context: "Meta-analiz için Python kodu yazmak istiyorsunuz. PythonMeta kullanarak orman grafiği ve huni grafiği oluşturmalısınız.",
          task: "Kod üretimi promptu stratejisi?",
          options: [
            {
              text: "Basit talimat: Meta-analiz kodu yaz ve gerekli tüm adımları sen belirle.",
              score: 20,
              feedback: "Çok belirsiz. Spesifik adımlar, paketler ve çıktılar belirtmelisiniz."
            },
            {
              text: "Ayrıntılı talimat: PythonMeta kur, MH ve DL modelleri, orman/huni grafikleri, Egger testi yap.",
              score: 100,
              feedback: "Harika! Tablo 11 stratejisi. Adım-adım, spesifik paketler, net çıktı formatı. GPT-4o ve Claude çalışan kod üretir!",
              isCorrect: true
            },
            {
              text: "GenAI'a bırak: Meta-analiz yap, hangi yöntem ve paketi kullanacağına sen karar ver.",
              score: 30,
              feedback: "Metodoloji kontrolünü kaybedersiniz. Spesifik yöntemler (MH, DL) ve adımlar belirtin."
            }
          ],
          learningPoints: [
            "Kod üretimi: Adım-adım talimatlar",
            "İstatistiksel özgüllük: MH (sabit-etki), DL (rastgele-etkiler)",
            "Doğrulama: Üretilen kodu her zaman kontrol edin ve çalıştırın"
          ]
        },
        {
          id: "da2",
          context: "Teori-oluşturma incelemesi yapıyorsunuz. Ortaya çıkan teorik fikirleri geliştirmek istiyorsunuz.",
          task: "GenAI'ı nasıl kullanırsınız?",
          options: [
            {
              text: "Tam sentez: Teorik çerçeveyi oluştur, yaz ve tüm sentezi sen tamamla.",
              score: 20,
              feedback: "Hayır! Teori-oluşturma derin insan yorumu gerektirir. GenAI'ın rolü artırma, yerini almak değil."
            },
            {
              text: "Sokratik diyalog: Araştırıcı sorular sor, teorik fikirlerimi eleştirel incele, diyaloga gir.",
              score: 100,
              feedback: "Mükemmel! Tablo 12, Ding ve arkadaşları (2024) stratejisi. Epistemik argümantasyon için Sokratik yöntem. Diyalog yoluyla fikir rafine etme.",
              isCorrect: true
            },
            {
              text: "Manuel yaklaşım: GenAI'ı yoksay ve teori-oluşturmayı tamamen manuel tamamla.",
              score: 50,
              feedback: "GenAI fikir üretimi ve rafine etme için yararlı. Sokratik diyalog çok etkili (Ngwenyama ve Rowe 2024)."
            }
          ],
          learningPoints: [
            "Teori-oluşturma: İnsan-merkezli, GenAI artırır",
            "Sokratik yöntem: Araştırıcı sorular, eleştirel inceleme",
            "Epistemik argümantasyon: İnceleme, sezgisel, düzeltme, özetleme"
          ]
        }
      ]
    },
    {
      id: 7,
      title: "Sentez ve Yazma",
      icon: FileText,
      description: "Bulguları sentezle ve rapor yaz",
      color: "bg-pink-500",
      scenarios: [
        {
          id: "sw1",
          context: "Son inceleme makalesini yazıyorsunuz. Telif hakkı ve yerinden etme kaygıları var.",
          task: "Doğru yazma stratejisi?",
          options: [
            {
              text: "Doğrudan alıntılar: Her bulgu için 20-30 kelimelik uzun doğrudan alıntılar kullanarak yaz.",
              score: 0,
              feedback: "ÇOK YANLIŞ! Telif hakkı ihlali. Alıntı başına <15 kelime, kaynak başına MAKSIMUM BİR alıntı. Parafraz varsayılan olmalı."
            },
            {
              text: "Parafraz öncelikli: Bulguları parafraz et, kaynak başına maks 1 alıntı (<15 kelime), yapı kopyalama.",
              score: 100,
              feedback: "Mükemmel! KRİTİK_TELİF_HAKKI_UYUM kuralları. Parafraz varsayılan, alıntılar nadir istisnalar, yerinden etme yok.",
              isCorrect: true
            },
            {
              text: "Uzun özetler: Her makale için ayrıntılı 200 kelimelik özet hazırlayarak derle.",
              score: 10,
              feedback: "Yerinden etme riski! Uzun özetler (30+ kelime) okumayı yerinden etebilir. Kısa parafraz + sentez tercih edilmeli."
            }
          ],
          learningPoints: [
            "Telif hakkı katı limitleri: Alıntı başına <15 kelime, kaynak başına 1 alıntı",
            "Parafraz varsayılan: Kendi sözlerinizle yeniden yazın",
            "Yerinden etme yok: Özetler okumayı yerinden etmemeli"
          ]
        },
        {
          id: "sw2",
          context: "İnceleme makalesinde GenAI kullanımını nasıl rapor edeceksiniz?",
          task: "Şeffaflık ve raporlama?",
          options: [
            {
              text: "Gizle ve söyleme: GenAI kullandığını hiç belirtme, sanki manuel yapmışsın gibi sun.",
              score: 0,
              feedback: "ÇOK YANLIŞ! Etik ihlal. Şeffaflık zorunludur (Templier ve Paré 2018)."
            },
            {
              text: "Tam açıklama: Araçlar, görevler, promptlar, doğrulama süreci ve kısıtlamaları detaylı belirt.",
              score: 100,
              feedback: "Mükemmel! Şeffaflık standartları: Hangi araçlar, hangi görevler, nasıl doğrulandı, hangi kısıtlamalar. Tekrarlanabilirlik için gerekli.",
              isCorrect: true
            },
            {
              text: "Genel ifade: Sadece 'Yapay zeka kullanıldı' diye kısa bir cümle ile geç.",
              score: 30,
              feedback: "Yetersiz. Spesifik araçlar, görevler, doğrulama süreçleri ve kısıtlamalar belirtilmeli."
            }
          ],
          learningPoints: [
            "Şeffaflık: GenAI kullanımını, araçları, görevleri, doğrulamayı açıklayın",
            "Tekrarlanabilirlik: Promptları, süreçleri, kararları paylaşın",
            "Kısıtlamalar: GenAI kısıtlamalarını kabul edin (yanılsama, önyargı)"
          ]
        }
      ]
    }
  ],
  
  en: [
    {
      id: 1,
      title: "Problem Formulation",
      icon: Lightbulb,
      description: "Identify research opportunity and select review type",
      color: "bg-purple-500",
      scenarios: [
        {
          id: "pf1",
          context: "You want to research the impact of digital transformation on organizational culture. You have collected 15 papers on the topic.",
          task: "What prompt would you give to GenAI?",
          options: [
            {
              text: "How is digital transformation defined in these papers?",
              score: 40,
              feedback: "Good start but too narrow. A more structured data extraction prompt like in Table 2 is preferred."
            },
            {
              text: "Upload PDFs: From the PDFs provided, extract the definitions for 'digital transformation'. Provide a direct quote if defined. If there is none, state that there is no clear definition.",
              score: 100,
              feedback: "Excellent! You correctly applied the zero-shot prompting strategy from Wagner et al. Table 2. Systematic and verifiable.",
              isCorrect: true
            },
            {
              text: "What is digital transformation?",
              score: 10,
              feedback: "No! This uses GenAI's general knowledge. Retrieval-Augmented Generation (RAG) is needed for papers."
            }
          ],
          learningPoints: [
            "Zero-shot prompting: Define the task clearly",
            "Use PDF upload feature (RAG)",
            "Request structured output (table, list, etc.)"
          ]
        },
        {
          id: "pf2",
          context: "You want to identify prior review studies in the literature. You have 25 PDFs.",
          task: "What is the most appropriate prompting strategy?",
          options: [
            {
              text: "Exploratory prompting: 'Considering the in-text citations of each paper, do the papers refer to prior literature reviews?'",
              score: 100,
              feedback: "Excellent! You correctly applied the exploratory prompting strategy from Table 1. Open-ended question with citation context analysis.",
              isCorrect: true
            },
            {
              text: "Chain-of-thought: 'First read each paper's references, then categorize review types, then summarize.'",
              score: 60,
              feedback: "CoT can be useful but too complex for this task. Exploratory prompting is more direct and effective."
            },
            {
              text: "Few-shot: Give examples of review papers and find similar ones.",
              score: 30,
              feedback: "Few-shot is unnecessary here. Exploratory approach is sufficient and faster for citation analysis."
            }
          ],
          learningPoints: [
            "Exploratory prompting: Theme discovery with open-ended questions",
            "Citation context analysis: Examine in-text references",
            "Start broad in problem formulation phase"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Literature Search",
      icon: Search,
      description: "Develop search strategy and explore with GenAI",
      color: "bg-blue-500",
      scenarios: [
        {
          id: "ls1",
          context: "You're researching the effect of LLMs on programmer productivity. You want to create a Boolean query.",
          task: "What is the most effective prompt strategy?",
          options: [
            {
              text: "Ask ChatGPT directly: 'Write a Boolean query for LLM productivity'",
              score: 20,
              feedback: "Too simple. You'll get better results with few-shot prompting by providing examples."
            },
            {
              text: "Few-shot: 'You are an information specialist. Example: \"Review of IT Business Value\" → TI=(IT OR IS) AND TI=(value OR payoff). Now generate for: Effect of LLM on individual performance at work'",
              score: 100,
              feedback: "Great! You correctly used the few-shot strategy from Table 5. Teaching by example, role-based prompting, and structured format.",
              isCorrect: true
            },
            {
              text: "Zero-shot: 'Create Web of Science query: LLM performance research'",
              score: 50,
              feedback: "Good but few-shot gives better results. Wang et al. (2023) proved this."
            }
          ],
          learningPoints: [
            "Few-shot prompting: Teach by example",
            "Role-based prompting: 'You are an information specialist...'",
            "Boolean query: Building block approach (Facet A OR B) AND (Facet C OR D)"
          ]
        },
        {
          id: "ls2",
          context: "You want to explore the literature using specialized tools like Elicit or Consensus.",
          task: "What's the correct approach for RAG-based exploratory search?",
          options: [
            {
              text: "Generic question: 'What do you know about LLM and productivity?'",
              score: 10,
              feedback: "No! This doesn't use RAG, relies on GenAI's general knowledge. High hallucination risk."
            },
            {
              text: "Structured query: 'How does [skill level] affect the relationship between [LLM support] and [productivity] in [software development]? Summarize with method and findings.'",
              score: 100,
              feedback: "Excellent! RAG strategy from Table 4. Structured question + specific output format + empirical papers focus.",
              isCorrect: true
            },
            {
              text: "Open-ended: 'List LLM research'",
              score: 30,
              feedback: "Too broad. Leverage RAG's power with a specific research question."
            }
          ],
          learningPoints: [
            "RAG: Retrieval-Augmented Generation reduces hallucination",
            "Specialized tools: Consensus, Elicit, Scopus AI",
            "Structured questions: [variable] affect [outcome] in [context]"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Literature Screening",
      icon: Filter,
      description: "Filter papers based on relevance criteria",
      color: "bg-green-500",
      scenarios: [
        {
          id: "sc1",
          context: "You have 500 paper title-abstracts. You want to screen with GenAI but recall is critical.",
          task: "What is the correct screening prompt strategy?",
          options: [
            {
              text: "Strict: 'Only include if directly about GenAI and programmer productivity. Be strict.'",
              score: 30,
              feedback: "No! This lowers recall. 'Be lenient' approach is recommended for screening (Table 6)."
            },
            {
              text: "Lenient: 'Decide include or exclude. Be lenient. I prefer including papers by mistake rather than excluding them by mistake.'",
              score: 100,
              feedback: "Excellent! Syriani et al. (2024) F2-maximizing prompt. In screening, false positives are less harmful than false negatives.",
              isCorrect: true
            },
            {
              text: "Balanced: 'Decide: include or exclude. Be balanced.'",
              score: 50,
              feedback: "Neutral but the paper recommends lenient approach. Better to be conservative in initial screening."
            }
          ],
          learningPoints: [
            "Screening principle: Lenient > Strict (for borderline cases)",
            "Two-stage screening: 1) Title/Abstract 2) Full-text",
            "GenAI limitations: Perfect recall not yet guaranteed"
          ]
        },
        {
          id: "sc2",
          context: "You have multilingual papers (Turkish, English, French). You must screen all of them.",
          task: "How do you overcome the language barrier?",
          options: [
            {
              text: "Manual translation: Translate each one manually",
              score: 20,
              feedback: "Inefficient. You should use GenAI's translation capability."
            },
            {
              text: "GenAI batch translation: 'Translate the abstract to English (if necessary)' + structured output (Markdown table)",
              score: 100,
              feedback: "Great! Strategy from Table 7. GROBID + LLM for automatic translation + structured output. Reduces geographical bias.",
              isCorrect: true
            },
            {
              text: "Only take English papers",
              score: 0,
              feedback: "No! Van Wee & Banister (2023): This creates language bias. Important findings will be missed."
            }
          ],
          learningPoints: [
            "GenAI translation: DeepL, GPT-4o, Claude 3.5",
            "GROBID: PDF → TEI/XML conversion",
            "Avoid bias: Include multilingual literature"
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Quality Assessment",
      icon: Target,
      description: "Evaluate methodological quality of studies",
      color: "bg-yellow-500",
      scenarios: [
        {
          id: "qa1",
          context: "You're doing a meta-analysis. You must extract study design, sample size, data collection, and statistics from each study.",
          task: "Prompt for quality assessment?",
          options: [
            {
              text: "Unstructured: 'What is the quality of this study?'",
              score: 20,
              feedback: "Too vague. You should specify specific methodological dimensions."
            },
            {
              text: "Structured: 'Analyze the study and identify: study design, sample size, data collection methods, statistical analyses. Present in Markdown table.'",
              score: 100,
              feedback: "Excellent! Zero-shot approach from Table 8. Specific dimensions + structured output. Ideal for parallel independent assessment.",
              isCorrect: true
            },
            {
              text: "Let GenAI decide: 'Extract methodological features you find important'",
              score: 40,
              feedback: "Leaving it to GenAI's judgment creates inconsistency. Use predefined criteria."
            }
          ],
          learningPoints: [
            "Quality assessment: Study design, sample, methods, statistics",
            "Structured output: Markdown table, JSON",
            "Parallel independent assessment: Human + GenAI comparison"
          ]
        },
        {
          id: "qa2",
          context: "You're doing a qualitative systematic review. You want to detect questionable research practices (QRP).",
          task: "What should GenAI's role be?",
          options: [
            {
              text: "Full automation: 'Detect all QRPs and score studies'",
              score: 30,
              feedback: "Risky! GenAI can detect logical errors but final judgment requires human oversight."
            },
            {
              text: "Augmentation: 'Flag potential issues: p-hacking, HARKing, selective reporting. I will review flagged items.'",
              score: 100,
              feedback: "Correct approach! GenAI assists (augments), doesn't decide. Human-in-the-loop model (Habernal et al. 2018).",
              isCorrect: true
            },
            {
              text: "Ignore GenAI: Review manually",
              score: 50,
              feedback: "Fully manual is too slow. GenAI flagging + human review combination is optimal."
            }
          ],
          learningPoints: [
            "QRP detection: p-hacking, HARKing, selective reporting",
            "Human-in-the-loop: GenAI flags, human decides",
            "GenAI limitation: Nuanced judgment still limited"
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Data Extraction",
      icon: Database,
      description: "Extract structured data from papers",
      color: "bg-red-500",
      scenarios: [
        {
          id: "de1",
          context: "You want to extract correlation tables for meta-analysis. You have 50 studies.",
          task: "Effective data extraction strategy?",
          options: [
            {
              text: "Manual: Extract each table by hand",
              score: 30,
              feedback: "Too slow. GenAI has table extraction capability (Table 10)."
            },
            {
              text: "GenAI structured extraction: Python pseudocode with MarkdownDataFrame, extract_table_from_image, validation",
              score: 100,
              feedback: "Great! Table 10 strategy. Image → Markdown → DataFrame. GPT-4o 4/5, Claude 3.5 Sonnet 5/5 success.",
              isCorrect: true
            },
            {
              text: "OCR tool: Extract text with Tesseract",
              score: 50,
              feedback: "OCR is sufficient but GenAI multimodal models (GPT-4o, Gemini) are more accurate and context-aware."
            }
          ],
          learningPoints: [
            "Multimodal GenAI: Image + Text processing",
            "Structured output: DataFrame, JSON schema validation",
            "Jagged frontier: Table extraction strong, but contextual interpretation weak"
          ]
        },
        {
          id: "de2",
          context: "You want to summarize 100 papers for a descriptive review. You need 3-4 sentence summaries for each.",
          task: "Optimal summarization strategy?",
          options: [
            {
              text: "Simple: 'Summarize this paper in 3 sentences'",
              score: 40,
              feedback: "Works but entity density is low. Chain-of-density is better."
            },
            {
              text: "Chain-of-density: 5 iterations, add missing entities each step, same length, increasing density",
              score: 100,
              feedback: "Excellent! Table 9, Adams et al. (2023) strategy. Maximum entity density, surpasses human summaries.",
              isCorrect: true
            },
            {
              text: "Detailed: 'Write a comprehensive 500-word summary'",
              score: 20,
              feedback: "No! Copyright risk + displacement concern. Brief, high-density summaries should be preferred."
            }
          ],
          learningPoints: [
            "Chain-of-density prompting: Iterative, increasing entity density",
            "Copyright compliance: <15 words quotes, paraphrase",
            "Displacement risk: Summaries should not replace reading"
          ]
        }
      ]
    },
    {
      id: 6,
      title: "Data Analysis",
      icon: BarChart3,
      description: "Analyze data and synthesize",
      color: "bg-indigo-500",
      scenarios: [
        {
          id: "da1",
          context: "You want to write Python code for meta-analysis. You should create forest plots and funnel plots using PythonMeta.",
          task: "Code generation prompt strategy?",
          options: [
            {
              text: "Simple: 'Write meta-analysis code'",
              score: 20,
              feedback: "Too vague. You should specify specific steps, packages, and outputs."
            },
            {
              text: "Detailed instruction: 'As Python expert, generate code: 1) Install PythonMeta, 2) Binary outcome + Risk Ratio, MH and DL models, 3) Forest and funnel plots, 4) Missing data imputation, 5) Egger's test. Format tables clearly.'",
              score: 100,
              feedback: "Great! Table 11 strategy. Step-by-step, specific packages, clear output format. GPT-4o & Claude produce working code!",
              isCorrect: true
            },
            {
              text: "Let GenAI choose: 'Do meta-analysis, you choose the method'",
              score: 30,
              feedback: "You lose methodology control. Specify specific methods (MH, DL) and steps."
            }
          ],
          learningPoints: [
            "Code generation: Step-by-step instructions",
            "Statistical specificity: MH (fixed-effect), DL (random-effects)",
            "Verification: Always check and run generated code"
          ]
        },
        {
          id: "da2",
          context: "You're doing a theory-building review. You want to develop emerging theoretical ideas.",
          task: "How do you use GenAI?",
          options: [
            {
              text: "Full synthesis: 'Create and write theoretical framework'",
              score: 20,
              feedback: "No! Theory-building requires deep human interpretation. GenAI's role is augmentation, not replacement."
            },
            {
              text: "Socratic dialogue: 'You are an AI capable of Socratic conversations. Ask probing questions to help me critically examine my theoretical ideas about [attached papers]. Engage in back-and-forth.'",
              score: 100,
              feedback: "Excellent! Table 12, Ding et al. (2024) strategy. Socratic method for epistemic argumentation. Idea refinement through dialogue.",
              isCorrect: true
            },
            {
              text: "Ignore GenAI: Theory-building completely manual",
              score: 50,
              feedback: "GenAI is useful for idea generation and refinement. Socratic dialogue is very effective (Ngwenyama & Rowe 2024)."
            }
          ],
          learningPoints: [
            "Theory-building: Human-centric, GenAI augments",
            "Socratic method: Probing questions, critical examination",
            "Epistemic argumentation: Review, heuristic, rectification, summarization"
          ]
        }
      ]
    },
    {
      id: 7,
      title: "Synthesis & Writing",
      icon: FileText,
      description: "Synthesize findings and write report",
      color: "bg-pink-500",
      scenarios: [
        {
          id: "sw1",
          context: "You're writing the final review paper. There are copyright and displacement concerns.",
          task: "What's the correct writing strategy?",
          options: [
            {
              text: "Direct quotes: Use 20-30 word direct quotes for each finding",
              score: 0,
              feedback: "VERY WRONG! Copyright violation. <15 words per quote, ONE quote per source MAX. Paraphrase should be default."
            },
            {
              text: "Paraphrase-first: Paraphrase all findings. Max 1 quote per source, <15 words. Avoid article structure replication.",
              score: 100,
              feedback: "Excellent! CRITICAL_COPYRIGHT_COMPLIANCE rules. Paraphrase default, quotes rare exceptions, no displacement.",
              isCorrect: true
            },
            {
              text: "Summarize articles: 200-word summary for each article",
              score: 10,
              feedback: "Displacement risk! Long summaries (30+ words) may replace reading. Brief paraphrase + synthesis should be preferred."
            }
          ],
          learningPoints: [
            "Copyright hard limits: <15 words per quote, 1 quote per source",
            "Paraphrase default: Rewrite in your own words",
            "No displacement: Summaries shouldn't replace reading"
          ]
        },
        {
          id: "sw2",
          context: "How will you report GenAI use in the review paper?",
          task: "Transparency and reporting?",
          options: [
            {
              text: "Hide: Don't mention GenAI use",
              score: 0,
              feedback: "VERY WRONG! Ethical violation. Transparency is mandatory (Templier & Paré 2018)."
            },
            {
              text: "Full disclosure: 'GenAI used for [specific tasks]. Prompts: [examples]. Human verification: [process]. Limitations: [acknowledged].'",
              score: 100,
              feedback: "Excellent! Transparency standards: Which tools, which tasks, how validated, what limitations. Essential for reproducibility.",
              isCorrect: true
            },
            {
              text: "Generic: 'AI was used'",
              score: 30,
              feedback: "Insufficient. Specific tools, tasks, validation processes, and limitations should be specified."
            }
          ],
          learningPoints: [
            "Transparency: Disclose GenAI use, tools, tasks, validation",
            "Reproducibility: Share prompts, processes, decisions",
            "Limitations: Acknowledge GenAI constraints (hallucination, bias)"
          ]
        }
      ]
    }
  ]
};

const LiteratureReviewGame = () => {
  const [language, setLanguage] = useState('tr');
  const [currentStage, setCurrentStage] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [stageScores, setStageScores] = useState(Array(7).fill(0));
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const t = translations[language];
  const stages = GAME_STAGES[language];
  
  const totalScenarios = stages.reduce((sum, stage) => sum + stage.scenarios.length, 0);
  const maxPossibleScore = totalScenarios * 100;

  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle options when scenario changes
  useEffect(() => {
    if (gameStarted && !showBriefing && !showResults) {
      const scenario = stages[currentStage].scenarios[currentScenario];
      const optionsWithIndex = scenario.options.map((opt, idx) => ({ ...opt, originalIndex: idx }));
      setShuffledOptions(shuffleArray(optionsWithIndex));
    }
  }, [currentStage, currentScenario, gameStarted, showBriefing, showResults, language]);

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  const handleAnswerSelect = (shuffledIndex) => {
    if (showFeedback) return;
    
    const option = shuffledOptions[shuffledIndex];
    setSelectedAnswer(shuffledIndex);
    setShowFeedback(true);
    
    const newScore = score + option.score;
    setScore(newScore);
    
    const newStageScores = [...stageScores];
    newStageScores[currentStage] += option.score;
    setStageScores(newStageScores);
    
    setCompletedScenarios([...completedScenarios, `${currentStage}-${currentScenario}`]);
  };

  const handleNext = () => {
    const stage = stages[currentStage];
    
    if (currentScenario < stage.scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else if (currentStage < stages.length - 1) {
      // Moving to next stage - show briefing
      setCurrentStage(currentStage + 1);
      setCurrentScenario(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowBriefing(true);
    } else {
      setShowResults(true);
    }
  };

  const resetGame = () => {
    setCurrentStage(0);
    setCurrentScenario(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setStageScores(Array(7).fill(0));
    setCompletedScenarios([]);
    setGameStarted(false);
    setShowResults(false);
  };

  const getGrade = () => {
    const percentage = (score / maxPossibleScore) * 100;
    if (percentage >= 90) return { grade: 'A', message: t.gradeA, color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', message: t.gradeB, color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', message: t.gradeC, color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', message: t.gradeD, color: 'text-orange-600' };
    return { grade: 'F', message: t.gradeF, color: 'text-red-600' };
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
              >
                <Globe className="w-4 h-4" />
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
            </div>
            
            <div className="flex justify-center mb-6">
              <BookOpen className="w-24 h-24 text-indigo-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {t.welcomeTitle}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t.welcomeSubtitle}
            </p>
            
            <div className="bg-indigo-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                <Target className="mr-2" /> {t.aboutGame}
              </h2>
              <ul className="space-y-3 text-gray-700">
                {t.aboutPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: point }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">7</div>
                <div className="text-sm text-gray-600">{t.levels}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{totalScenarios}</div>
                <div className="text-sm text-gray-600">{t.scenarios}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">14</div>
                <div className="text-sm text-gray-600">{t.promptStrategies}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">~30{language === 'tr' ? 'dk' : 'min'}</div>
                <div className="text-sm text-gray-600">{t.duration}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setGameStarted(true);
                setShowBriefing(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {t.startGame} <ChevronRight className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const gradeInfo = getGrade();
    const percentage = (score / maxPossibleScore) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
              >
                <Globe className="w-4 h-4" />
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
            </div>
            
            <div className="text-center mb-8">
              <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-5xl font-bold text-gray-800 mb-2">{t.congratulations}</h1>
              <p className="text-xl text-gray-600">{t.completedAllLevels}</p>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{score}/{maxPossibleScore}</div>
                <div className="text-2xl mb-4">%{percentage.toFixed(1)} {t.successRate}</div>
                <div className={`text-5xl font-bold ${gradeInfo.color.replace('text-', 'text-white')} bg-white bg-opacity-20 rounded-lg py-4 px-8 inline-block`}>
                  {gradeInfo.grade}
                </div>
                <div className="text-xl mt-4">{gradeInfo.message}</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="mr-2" /> {t.performanceByLevel}
              </h2>
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const maxStageScore = stage.scenarios.length * 100;
                  const stagePercentage = (stageScores[index] / maxStageScore) * 100;
                  const StageIcon = stage.icon;
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`${stage.color} text-white p-2 rounded-lg mr-3`}>
                            <StageIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{stage.title}</div>
                            <div className="text-sm text-gray-600">{stageScores[index]}/{maxStageScore} {t.points.toLowerCase()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-gray-800">%{stagePercentage.toFixed(0)}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${stage.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${stagePercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <Brain className="mr-2" /> {t.keyConceptsLearned}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">{t.promptingStrategies}</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• {t.strategies.zeroShot}</li>
                    <li>• {t.strategies.fewShot}</li>
                    <li>• {t.strategies.chainOfThought}</li>
                    <li>• {t.strategies.rag}</li>
                    <li>• {t.strategies.exploratory}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">{t.methodologicalPrinciples}</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• {t.principles.systematicity}</li>
                    <li>• {t.principles.humanInLoop}</li>
                    <li>• {t.principles.copyright}</li>
                    <li>• {t.principles.biasMitigation}</li>
                    <li>• {t.principles.qualityAssessment}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center"
              >
                <RotateCcw className="mr-2" /> {t.playAgain}
              </button>
              <button
                onClick={() => window.open('https://journals.sagepub.com/doi/10.1177/02683962261425675', '_blank')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center"
              >
                <BookOpen className="mr-2" /> {t.readPaper}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Briefing screen
  if (showBriefing) {
    const briefing = STAGE_BRIEFINGS[language][currentStage];
    const stage = stages[currentStage];
    const StageIcon = stage.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center">
                <div className={`${stage.color} text-white p-4 rounded-xl mr-4`}>
                  <StageIcon className="w-10 h-10" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">{t.briefingTitle}</div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {stage.title}
                  </h1>
                </div>
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
              >
                <Globe className="w-4 h-4" />
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
            </div>

            {/* Briefing Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">{briefing.title}</h2>
              <p className="text-sm text-gray-500 italic">{t.basedOnWagner}</p>
            </div>

            {/* Key Points */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                {t.keyPoints}
              </h3>
              <ul className="space-y-3">
                {briefing.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start bg-green-50 p-4 rounded-lg">
                    <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Target className="w-6 h-6 text-orange-600 mr-2" />
                {t.challenges}
              </h3>
              <ul className="space-y-3">
                {briefing.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start bg-orange-50 p-4 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{challenge}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Methods */}
            <div className="mb-8">
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">{t.methods}:</h3>
                <p className="text-indigo-800 font-medium">{briefing.methods}</p>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowBriefing(false)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg flex items-center"
              >
                {t.startLevel} <ChevronRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const gradeInfo = getGrade();
    const percentage = (score / maxPossibleScore) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
              >
                <Globe className="w-4 h-4" />
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
            </div>
            
            <div className="text-center mb-8">
              <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-5xl font-bold text-gray-800 mb-2">{t.congratulations}</h1>
              <p className="text-xl text-gray-600">{t.completedAllLevels}</p>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{score}/{maxPossibleScore}</div>
                <div className="text-2xl mb-4">%{percentage.toFixed(1)} {t.successRate}</div>
                <div className={`text-5xl font-bold ${gradeInfo.color.replace('text-', 'text-white')} bg-white bg-opacity-20 rounded-lg py-4 px-8 inline-block`}>
                  {gradeInfo.grade}
                </div>
                <div className="text-xl mt-4">{gradeInfo.message}</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="mr-2" /> {t.performanceByLevel}
              </h2>
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const maxStageScore = stage.scenarios.length * 100;
                  const stagePercentage = (stageScores[index] / maxStageScore) * 100;
                  const StageIcon = stage.icon;
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`${stage.color} text-white p-2 rounded-lg mr-3`}>
                            <StageIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{stage.title}</div>
                            <div className="text-sm text-gray-600">{stageScores[index]}/{maxStageScore} {t.points.toLowerCase()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-gray-800">%{stagePercentage.toFixed(0)}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${stage.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${stagePercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <Brain className="mr-2" /> {t.keyConceptsLearned}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">{t.promptingStrategies}</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• {t.strategies.zeroShot}</li>
                    <li>• {t.strategies.fewShot}</li>
                    <li>• {t.strategies.chainOfThought}</li>
                    <li>• {t.strategies.rag}</li>
                    <li>• {t.strategies.exploratory}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">{t.methodologicalPrinciples}</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• {t.principles.systematicity}</li>
                    <li>• {t.principles.humanInLoop}</li>
                    <li>• {t.principles.copyright}</li>
                    <li>• {t.principles.biasMitigation}</li>
                    <li>• {t.principles.qualityAssessment}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center"
              >
                <RotateCcw className="mr-2" /> {t.playAgain}
              </button>
              <button
                onClick={() => window.open('https://journals.sagepub.com/doi/10.1177/02683962261425675', '_blank')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center"
              >
                <BookOpen className="mr-2" /> {t.readPaper}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stage = stages[currentStage];
  const scenario = stage.scenarios[currentScenario];
  const StageIcon = stage.icon;
  const selectedOption = selectedAnswer !== null ? scenario.options[selectedAnswer] : null;
  const progress = ((completedScenarios.length) / totalScenarios) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{language === 'tr' ? 'GenAI Literatür Tarama' : 'GenAI Literature Review'}</h1>
                <p className="text-sm text-gray-600">Wagner et al. (2026) - Training Game</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
              >
                <Globe className="w-4 h-4" />
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{score}</div>
                <div className="text-sm text-gray-600">{t.totalScore}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>{t.progress}</span>
            <span>{completedScenarios.length}/{totalScenarios} {t.scenariosCompleted}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage Header */}
        <div className={`${stage.color} text-white rounded-2xl shadow-lg p-6 mb-6`}>
          <div className="flex items-center mb-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
              <StageIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm opacity-90">{t.stageLabel} {currentStage + 1} / {stages.length}</div>
              <h2 className="text-3xl font-bold">{stage.title}</h2>
            </div>
          </div>
          <p className="text-lg opacity-90">{stage.description}</p>
          <div className="mt-3 text-sm opacity-75">
            {t.scenarioLabel} {currentScenario + 1} / {stage.scenarios.length}
          </div>
        </div>

        {/* Scenario Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Context */}
          <div className="mb-6">
            <div className="flex items-start mb-3">
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold mr-3 flex-shrink-0">
                {t.situation}
              </div>
              <p className="text-gray-700 leading-relaxed">{scenario.context}</p>
            </div>
          </div>

          {/* Task */}
          <div className="mb-8">
            <div className="flex items-start mb-3">
              <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-bold mr-3 flex-shrink-0">
                {t.task}
              </div>
              <p className="text-gray-800 font-semibold text-lg">{scenario.task}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {shuffledOptions.map((option, shuffledIndex) => {
              const isSelected = selectedAnswer === shuffledIndex;
              const isCorrect = option.isCorrect;
              
              let bgColor = 'bg-gray-50 hover:bg-gray-100 border-gray-200';
              let borderColor = 'border-2';
              
              if (showFeedback && isSelected) {
                if (isCorrect) {
                  bgColor = 'bg-green-50 border-green-500';
                  borderColor = 'border-4';
                } else {
                  bgColor = 'bg-red-50 border-red-500';
                  borderColor = 'border-4';
                }
              }
              
              return (
                <button
                  key={shuffledIndex}
                  onClick={() => handleAnswerSelect(shuffledIndex)}
                  disabled={showFeedback}
                  className={`w-full text-left p-5 rounded-xl ${borderColor} ${bgColor} transition-all ${!showFeedback ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 ${
                      showFeedback && isSelected
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {showFeedback && isSelected ? (
                        isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + shuffledIndex)
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm leading-relaxed">{option.text}</p>
                      {showFeedback && isSelected && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-start mb-2">
                            <Zap className={`w-5 h-5 mr-2 flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                            <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                              {option.feedback}
                            </p>
                          </div>
                          <div className="mt-2 bg-gray-100 rounded-lg p-3">
                            <div className="text-sm font-bold text-gray-700 mb-1">{t.points}: {option.score}/100</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning Points (show after feedback) */}
        {showFeedback && (
          <div className="bg-blue-50 rounded-2xl shadow-lg p-6 mb-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <Star className="mr-2" /> {t.learningPoints}
            </h3>
            <ul className="space-y-2">
              {scenario.learningPoints.map((point, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Button */}
        {showFeedback && (
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              {currentScenario < stage.scenarios.length - 1
                ? t.nextScenario
                : currentStage < stages.length - 1
                ? t.nextLevel
                : t.viewResults}
              <ChevronRight className="ml-2" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LiteratureReviewGame;