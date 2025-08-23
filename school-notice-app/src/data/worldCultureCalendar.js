/**
 * 세계 문화 캘린더 데이터
 * 월별/국가별 주요 문화 행사 및 기념일 정보
 */

// 국가별 문화 행사 데이터
export const COUNTRIES = {
  china: { code: 'CN', name: '중국', flag: '🇨🇳', language: 'zh-CN' },
  vietnam: { code: 'VN', name: '베트남', flag: '🇻🇳', language: 'vi' },
  philippines: { code: 'PH', name: '필리핀', flag: '🇵🇭', language: 'tl' },
  thailand: { code: 'TH', name: '태국', flag: '🇹🇭', language: 'th' },
  mongolia: { code: 'MN', name: '몽골', flag: '🇲🇳', language: 'mn' },
  uzbekistan: { code: 'UZ', name: '우즈베키스탄', flag: '🇺🇿', language: 'uz' },
  russia: { code: 'RU', name: '러시아', flag: '🇷🇺', language: 'ru' },
  japan: { code: 'JP', name: '일본', flag: '🇯🇵', language: 'ja' },
  cambodia: { code: 'KH', name: '캄보디아', flag: '🇰🇭', language: 'km' },
  nepal: { code: 'NP', name: '네팔', flag: '🇳🇵', language: 'ne' },
  // 추가 국가들
  india: { code: 'IN', name: '인도', flag: '🇮🇳', language: 'hi' },
  bangladesh: { code: 'BD', name: '방글라데시', flag: '🇧🇩', language: 'bn' },
  myanmar: { code: 'MM', name: '미얀마', flag: '🇲🇲', language: 'my' },
  laos: { code: 'LA', name: '라오스', flag: '🇱🇦', language: 'lo' },
  indonesia: { code: 'ID', name: '인도네시아', flag: '🇮🇩', language: 'id' },
  malaysia: { code: 'MY', name: '말레이시아', flag: '🇲🇾', language: 'ms' },
  sri_lanka: { code: 'LK', name: '스리랑카', flag: '🇱🇰', language: 'si' },
  pakistan: { code: 'PK', name: '파키스탄', flag: '🇵🇰', language: 'ur' },
  turkey: { code: 'TR', name: '터키', flag: '🇹🇷', language: 'tr' },
  iran: { code: 'IR', name: '이란', flag: '🇮🇷', language: 'fa' },
  kazakhstan: { code: 'KZ', name: '카자흐스탄', flag: '🇰🇿', language: 'kk' },
  kyrgyzstan: { code: 'KG', name: '키르기스스탄', flag: '🇰🇬', language: 'ky' },
  tajikistan: { code: 'TJ', name: '타지키스탄', flag: '🇹🇯', language: 'tg' },
  afghanistan: { code: 'AF', name: '아프가니스탄', flag: '🇦🇫', language: 'fa' },
  brazil: { code: 'BR', name: '브라질', flag: '🇧🇷', language: 'pt' },
  peru: { code: 'PE', name: '페루', flag: '🇵🇪', language: 'es' },
  nigeria: { code: 'NG', name: '나이지리아', flag: '🇳🇬', language: 'en' },
  ghana: { code: 'GH', name: '가나', flag: '🇬🇭', language: 'en' },
  egypt: { code: 'EG', name: '이집트', flag: '🇪🇬', language: 'ar' },
  morocco: { code: 'MA', name: '모로코', flag: '🇲🇦', language: 'ar' },
  ethiopia: { code: 'ET', name: '에티오피아', flag: '🇪🇹', language: 'am' }
};

// 월별 세계 문화 행사 캘린더
export const MONTHLY_CULTURE_CALENDAR = {
  1: { // 1월
    events: [
      {
        date: '1월 1일',
        event: '설날 (음력)',
        countries: ['china', 'vietnam', 'mongolia'],
        type: 'traditional',
        description: '동아시아 최대의 명절로 가족이 모여 새해를 맞이하는 전통 행사',
        culturalNotes: '떡국, 세뱃돈, 조상 제례 등의 전통 풍습'
      },
      {
        date: '1월 26일',
        event: '호주의 날 (Australia Day)',
        countries: ['australia'],
        type: 'national',
        description: '호주의 국경일로 다문화 축제가 열리는 날',
        culturalNotes: '바비큐 파티, 시민권 수여식 등'
      }
    ]
  },
  2: { // 2월
    events: [
      {
        date: '2월 10일경',
        event: '춘절 (Chinese New Year)',
        countries: ['china', 'vietnam', 'mongolia'],
        type: 'traditional',
        description: '중국 전통 새해로 15일간 계속되는 최대 명절',
        culturalNotes: '용춤, 폭죽, 붉은 봉투(홍바오), 떡국'
      },
      {
        date: '2월 14일',
        event: '발렌타인 데이',
        countries: ['philippines', 'japan', 'thailand'],
        type: 'modern',
        description: '사랑하는 사람에게 마음을 전하는 날',
        culturalNotes: '초콜릿, 꽃다발, 편지 등 선물 교환'
      }
    ]
  },
  3: { // 3월
    events: [
      {
        date: '3월 8일',
        event: '국제 여성의 날',
        countries: ['russia', 'uzbekistan', 'mongolia'],
        type: 'international',
        description: '여성의 권리와 성취를 기념하는 국제적 기념일',
        culturalNotes: '꽃 선물, 여성에 대한 감사 표현'
      },
      {
        date: '3월 21일',
        event: '나우로즈 (페르시아 신년)',
        countries: ['iran', 'uzbekistan', 'tajikistan', 'afghanistan'],
        type: 'traditional',
        description: '페르시아 문화권의 전통 새해 축제',
        culturalNotes: '하프트신 상차림, 불 뛰어넘기 의식'
      }
    ]
  },
  4: { // 4월
    events: [
      {
        date: '4월 13-15일',
        event: '송끄란 (태국 새해)',
        countries: ['thailand', 'cambodia', 'laos', 'myanmar'],
        type: 'traditional',
        description: '동남아시아 불교 문화권의 물 축제',
        culturalNotes: '서로에게 물을 뿌리며 새해를 축하'
      },
      {
        date: '4월 14일',
        event: '바이사키 (시크교 새해)',
        countries: ['india', 'pakistan'],
        type: 'religious',
        description: '시크교도들의 새해 축제',
        culturalNotes: '구루드와라 방문, 랑가르(무료급식) 봉사'
      }
    ]
  },
  5: { // 5월
    events: [
      {
        date: '5월 1일',
        event: '노동절',
        countries: ['russia', 'china', 'vietnam'],
        type: 'national',
        description: '노동자의 권리와 연대를 기념하는 날',
        culturalNotes: '퍼레이드, 휴식, 가족 나들이'
      },
      {
        date: '5월 8일',
        event: '부처님 오신 날 (베사크)',
        countries: ['thailand', 'cambodia', 'sri_lanka', 'myanmar'],
        type: 'religious',
        description: '부처님의 탄생을 기념하는 불교 최대 명절',
        culturalNotes: '절 방문, 연등 행렬, 방생 의식'
      }
    ]
  },
  6: { // 6월
    events: [
      {
        date: '6월 12일',
        event: '필리핀 독립기념일',
        countries: ['philippines'],
        type: 'national',
        description: '스페인으로부터의 독립을 기념하는 날',
        culturalNotes: '국기 게양식, 전통 춤 공연'
      },
      {
        date: '6월 21일',
        event: '하지 축제 (백야 축제)',
        countries: ['russia', 'finland', 'sweden'],
        type: 'seasonal',
        description: '일년 중 가장 긴 낮을 기념하는 축제',
        culturalNotes: '백야 아래에서 밤새 축제'
      }
    ]
  },
  7: { // 7월
    events: [
      {
        date: '7월 11-13일',
        event: '나담 축제',
        countries: ['mongolia'],
        type: 'traditional',
        description: '몽골의 전통 스포츠 축제 (씨름, 활쏘기, 승마)',
        culturalNotes: '전통 복장 델 착용, 몽골 전통 음식'
      }
    ]
  },
  8: { // 8월
    events: [
      {
        date: '8월 15일',
        event: '인도 독립기념일',
        countries: ['india'],
        type: 'national',
        description: '영국으로부터의 독립을 기념하는 날',
        culturalNotes: '국기 게양, 총리 연설, 연 날리기'
      },
      {
        date: '8월 31일',
        event: '말레이시아 독립기념일',
        countries: ['malaysia'],
        type: 'national',
        description: '말레이시아의 독립을 기념하는 국경일',
        culturalNotes: '퍼레이드, 전통 문화 공연'
      }
    ]
  },
  9: { // 9월
    events: [
      {
        date: '9월 2일',
        event: '베트남 국경일',
        countries: ['vietnam'],
        type: 'national',
        description: '베트남 민주공화국 선언일을 기념',
        culturalNotes: '국기 게양식, 문화 공연'
      },
      {
        date: '9월 중순',
        event: '추석 (중추절)',
        countries: ['china', 'vietnam'],
        type: 'traditional',
        description: '달을 보며 가족이 모이는 전통 명절',
        culturalNotes: '월병 먹기, 등불 축제, 달 구경'
      }
    ]
  },
  10: { // 10월
    events: [
      {
        date: '10월 1일',
        event: '중국 국경일',
        countries: ['china'],
        type: 'national',
        description: '중화인민공화국 건국일',
        culturalNotes: '황금연휴(국경절 연휴), 대규모 여행'
      },
      {
        date: '10월 중순',
        event: '디왈리 (빛의 축제)',
        countries: ['india', 'nepal'],
        type: 'religious',
        description: '힌두교 최대 축제로 선악의 승리를 기념',
        culturalNotes: '등불 장식, 폭죽, 과자 나눠먹기'
      }
    ]
  },
  11: { // 11월
    events: [
      {
        date: '11월 9일',
        event: '네팔 헌법의 날',
        countries: ['nepal'],
        type: 'national',
        description: '네팔 헌법 제정을 기념하는 국경일',
        culturalNotes: '국기 게양, 문화 행사'
      }
    ]
  },
  12: { // 12월
    events: [
      {
        date: '12월 25일',
        event: '크리스마스',
        countries: ['philippines', 'russia'],
        type: 'religious',
        description: '예수 그리스도의 탄생을 기념하는 기독교 명절',
        culturalNotes: '미사, 선물 교환, 가족 모임'
      },
      {
        date: '12월 31일',
        event: '신정',
        countries: ['russia', 'thailand', 'vietnam'],
        type: 'international',
        description: '새해를 맞이하는 세계적 축제일',
        culturalNotes: '카운트다운, 불꽃놀이, 새해 결심'
      }
    ]
  }
};

// 오늘의 세계 문화 추천 알고리즘
export const getTodaysCulture = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  
  // 현재 월의 문화 행사들
  const monthlyEvents = MONTHLY_CULTURE_CALENDAR[month]?.events || [];
  
  // 오늘과 관련된 문화 행사 찾기
  const todaysEvents = monthlyEvents.filter(event => {
    // 간단한 날짜 매칭 로직 (실제로는 더 정교한 로직 필요)
    return event.date.includes(date.toString());
  });
  
  // 오늘 특별한 문화 행사가 없으면 이번 주 추천 문화
  if (todaysEvents.length === 0) {
    // 일주일에 1-2회 랜덤하게 문화 소개
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 2 || dayOfWeek === 5) { // 화요일, 금요일
      const allEvents = Object.values(MONTHLY_CULTURE_CALENDAR)
        .flatMap(month => month.events);
      const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
      return {
        isSpecialDay: false,
        recommendedEvent: randomEvent,
        message: '오늘의 세계문화 탐방'
      };
    }
    return null;
  }
  
  return {
    isSpecialDay: true,
    todaysEvents,
    message: '오늘은 특별한 세계문화의 날입니다!'
  };
};

// 국가별 문화 검색 함수
export const searchCultureByCountry = (countryCode) => {
  const allEvents = Object.values(MONTHLY_CULTURE_CALENDAR)
    .flatMap(month => month.events);
  
  return allEvents.filter(event => 
    event.countries.some(country => COUNTRIES[country]?.code === countryCode)
  );
};

// 월별 문화 검색 함수
export const getCultureByMonth = (month) => {
  return MONTHLY_CULTURE_CALENDAR[month]?.events || [];
};

// 새로운 국가의 문화 자동 생성 (AI 통합 준비)
export const generateCultureForCountry = async (countryName, geminiApiKey) => {
  // 실제 구현 시 Gemini API를 사용하여 해당 국가의 주요 문화 행사 생성
  const prompt = `${countryName}의 주요 문화 행사와 전통 명절을 월별로 3-5개 정리해주세요. 
  각 행사마다 날짜, 행사명, 문화적 의미, 전통 풍습을 포함해주세요.`;
  
  // TODO: Gemini API 호출하여 문화 데이터 생성
  console.log(`Generating culture data for ${countryName}...`);
  
  return {
    country: countryName,
    events: [
      {
        date: '예시 날짜',
        event: '예시 행사',
        type: 'traditional',
        description: '예시 설명',
        culturalNotes: '예시 문화적 특징'
      }
    ]
  };
};

export default {
  COUNTRIES,
  MONTHLY_CULTURE_CALENDAR,
  getTodaysCulture,
  searchCultureByCountry,
  getCultureByMonth,
  generateCultureForCountry
};