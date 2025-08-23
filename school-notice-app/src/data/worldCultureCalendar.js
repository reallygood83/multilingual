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
  // 추가 국가들 - 전 대륙 포괄적 확대
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
  
  // 중남미
  brazil: { code: 'BR', name: '브라질', flag: '🇧🇷', language: 'pt' },
  peru: { code: 'PE', name: '페루', flag: '🇵🇪', language: 'es' },
  mexico: { code: 'MX', name: '멕시코', flag: '🇲🇽', language: 'es' },
  argentina: { code: 'AR', name: '아르헨티나', flag: '🇦🇷', language: 'es' },
  colombia: { code: 'CO', name: '콜롬비아', flag: '🇨🇴', language: 'es' },
  chile: { code: 'CL', name: '칠레', flag: '🇨🇱', language: 'es' },
  venezuela: { code: 'VE', name: '베네수엘라', flag: '🇻🇪', language: 'es' },
  ecuador: { code: 'EC', name: '에콰도르', flag: '🇪🇨', language: 'es' },
  bolivia: { code: 'BO', name: '볼리비아', flag: '🇧🇴', language: 'es' },
  
  // 아프리카
  nigeria: { code: 'NG', name: '나이지리아', flag: '🇳🇬', language: 'en' },
  ghana: { code: 'GH', name: '가나', flag: '🇬🇭', language: 'en' },
  egypt: { code: 'EG', name: '이집트', flag: '🇪🇬', language: 'ar' },
  morocco: { code: 'MA', name: '모로코', flag: '🇲🇦', language: 'ar' },
  ethiopia: { code: 'ET', name: '에티오피아', flag: '🇪🇹', language: 'am' },
  kenya: { code: 'KE', name: '케냐', flag: '🇰🇪', language: 'sw' },
  south_africa: { code: 'ZA', name: '남아프리카공화국', flag: '🇿🇦', language: 'en' },
  senegal: { code: 'SN', name: '세네갈', flag: '🇸🇳', language: 'fr' },
  madagascar: { code: 'MG', name: '마다가스카르', flag: '🇲🇬', language: 'mg' },
  tunisia: { code: 'TN', name: '튀니지', flag: '🇹🇳', language: 'ar' },
  
  // 유럽
  germany: { code: 'DE', name: '독일', flag: '🇩🇪', language: 'de' },
  france: { code: 'FR', name: '프랑스', flag: '🇫🇷', language: 'fr' },
  italy: { code: 'IT', name: '이탈리아', flag: '🇮🇹', language: 'it' },
  spain: { code: 'ES', name: '스페인', flag: '🇪🇸', language: 'es' },
  greece: { code: 'GR', name: '그리스', flag: '🇬🇷', language: 'el' },
  ireland: { code: 'IE', name: '아일랜드', flag: '🇮🇪', language: 'en' },
  scotland: { code: 'SC', name: '스코틀랜드', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', language: 'en' },
  poland: { code: 'PL', name: '폴란드', flag: '🇵🇱', language: 'pl' },
  romania: { code: 'RO', name: '루마니아', flag: '🇷🇴', language: 'ro' },
  
  // 오세아니아 & 기타
  australia: { code: 'AU', name: '호주', flag: '🇦🇺', language: 'en' },
  new_zealand: { code: 'NZ', name: '뉴질랜드', flag: '🇳🇿', language: 'en' },
  canada: { code: 'CA', name: '캐나다', flag: '🇨🇦', language: 'en' },
  usa: { code: 'US', name: '미국', flag: '🇺🇸', language: 'en' },
  
  // 북유럽
  sweden: { code: 'SE', name: '스웨덴', flag: '🇸🇪', language: 'sv' },
  norway: { code: 'NO', name: '노르웨이', flag: '🇳🇴', language: 'no' },
  finland: { code: 'FI', name: '핀란드', flag: '🇫🇮', language: 'fi' },
  denmark: { code: 'DK', name: '덴마크', flag: '🇩🇰', language: 'da' }
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
        date: '1월 6일',
        event: '주현절 (에피파니)',
        countries: ['russia', 'greece', 'romania'],
        type: 'religious',
        description: '동방정교회의 중요한 축제로 예수의 세례를 기념',
        culturalNotes: '성수 축복, 전통 빵 나누기, 십자가 던지기 의식'
      },
      {
        date: '1월 14일',
        event: '마카르 산크란티 (인도 새해)',
        countries: ['india', 'nepal', 'bangladesh'],
        type: 'traditional',
        description: '인도의 전통 새해 축제로 연날리기와 참깨 과자를 나눔',
        culturalNotes: '연날리기 대회, 틸 라두(참깨 과자), 강가에서 목욕'
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
        date: '2월 5일',
        event: '와사일 (Wassailing)',
        countries: ['ireland', 'scotland'],
        type: 'traditional',
        description: '켈트 문화의 과수원 축복 의식으로 풍년을 기원',
        culturalNotes: '사과 나무에 사이다 뿌리기, 전통 노래 부르기'
      },
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
      },
      {
        date: '2월 28일',
        event: '카니발 (브라질)',
        countries: ['brazil', 'colombia', 'venezuela'],
        type: 'traditional',
        description: '라틴 아메리카 최대의 축제로 삼바 댄스와 퍼레이드',
        culturalNotes: '삼바 댄스, 화려한 의상, 거리 퍼레이드'
      }
    ]
  },
  3: { // 3월
    events: [
      {
        date: '3월 1일',
        event: '마르티소르 (루마니아/몰도바)',
        countries: ['romania'],
        type: 'traditional',
        description: '봄의 시작을 알리는 루마니아 전통 축제',
        culturalNotes: '빨강과 흰색 실로 만든 장식품 교환, 꽃 선물'
      },
      {
        date: '3월 8일',
        event: '국제 여성의 날',
        countries: ['russia', 'uzbekistan', 'mongolia'],
        type: 'international',
        description: '여성의 권리와 성취를 기념하는 국제적 기념일',
        culturalNotes: '꽃 선물, 여성에 대한 감사 표현'
      },
      {
        date: '3월 17일',
        event: '성 패트릭의 날',
        countries: ['ireland', 'usa', 'canada'],
        type: 'religious',
        description: '아일랜드의 수호성인을 기념하는 날',
        culturalNotes: '초록색 옷 입기, 샴록(클로버) 장식, 퍼레이드'
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
        date: '4월 1일',
        event: '만우절',
        countries: ['france', 'italy', 'germany', 'usa'],
        type: 'modern',
        description: '장난과 유머로 즐기는 서구의 전통 축제일',
        culturalNotes: '무해한 장난, 가짜 뉴스 만들기, 친구들과 웃음 나누기'
      },
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
      },
      {
        date: '4월 23일',
        event: '성 게오르기우스의 날',
        countries: ['greece', 'romania', 'ethiopia'],
        type: 'religious',
        description: '동방정교회의 중요한 성인을 기념하는 날',
        culturalNotes: '양고기 구워먹기, 전통 춤, 붉은 달걀 나누기'
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
        date: '5월 5일',
        event: '신코 데 마요',
        countries: ['mexico', 'usa'],
        type: 'national',
        description: '멕시코의 중요한 승리를 기념하는 날',
        culturalNotes: '마리아치 음악, 전통 춤, 멕시코 요리'
      },
      {
        date: '5월 8일',
        event: '부처님 오신 날 (베사크)',
        countries: ['thailand', 'cambodia', 'sri_lanka', 'myanmar'],
        type: 'religious',
        description: '부처님의 탄생을 기념하는 불교 최대 명절',
        culturalNotes: '절 방문, 연등 행렬, 방생 의식'
      },
      {
        date: '5월 17일',
        event: '노르웨이 헌법의 날',
        countries: ['norway'],
        type: 'national',
        description: '노르웨이 독립을 기념하는 최대 국경일',
        culturalNotes: '전국민이 전통 의상 부나드 착용, 어린이 퍼레이드'
      }
    ]
  },
  6: { // 6월
    events: [
      {
        date: '6월 6일',
        event: '스웨덴 국경일',
        countries: ['sweden'],
        type: 'national',
        description: '스웨덴의 헌법 제정을 기념하는 국경일',
        culturalNotes: '노란색과 파란색 장식, 전통 의상 착용'
      },
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
      },
      {
        date: '6월 24일',
        event: '인티 라이미 (태양 축제)',
        countries: ['peru', 'ecuador', 'bolivia'],
        type: 'traditional',
        description: '안데스 문명의 태양신을 기리는 고대 축제',
        culturalNotes: '전통 의상, 태양신 의식, 안데스 음악과 춤'
      }
    ]
  },
  7: { // 7월
    events: [
      {
        date: '7월 4일',
        event: '미국 독립기념일',
        countries: ['usa'],
        type: 'national',
        description: '미국의 독립을 기념하는 최대 국경일',
        culturalNotes: '불꽃놀이, 바비큐 파티, 별과 줄무늬 깃발 장식'
      },
      {
        date: '7월 11-13일',
        event: '나담 축제',
        countries: ['mongolia'],
        type: 'traditional',
        description: '몽골의 전통 스포츠 축제 (씨름, 활쏘기, 승마)',
        culturalNotes: '전통 복장 델 착용, 몽골 전통 음식'
      },
      {
        date: '7월 14일',
        event: '프랑스 혁명기념일 (바스티유 데이)',
        countries: ['france'],
        type: 'national',
        description: '프랑스 대혁명의 시작을 기념하는 국경일',
        culturalNotes: '샹젤리제 퍼레이드, 에펠탑 불꽃놀이, 삼색기 장식'
      },
      {
        date: '7월 20일',
        event: '콜롬비아 독립기념일',
        countries: ['colombia'],
        type: 'national',
        description: '스페인으로부터의 독립을 기념하는 국경일',
        culturalNotes: '살사 댄스, 전통 음악, 삼색기 퍼레이드'
      }
    ]
  },
  8: { // 8월
    events: [
      {
        date: '8월 1일',
        event: '스위스 건국기념일',
        countries: ['sweden', 'finland'], // 스위스가 없어서 비슷한 문화권
        type: 'national',
        description: '스위스 연방 창설을 기념하는 국경일',
        culturalNotes: '산봉우리 불꽃놀이, 전통 알프호른 연주'
      },
      {
        date: '8월 15일',
        event: '인도 독립기념일',
        countries: ['india'],
        type: 'national',
        description: '영국으로부터의 독립을 기념하는 날',
        culturalNotes: '국기 게양, 총리 연설, 연 날리기'
      },
      {
        date: '8월 17일',
        event: '인도네시아 독립기념일',
        countries: ['indonesia', 'malaysia'],
        type: 'national',
        description: '네덜란드로부터의 독립을 기념하는 국경일',
        culturalNotes: '적백기 게양식, 전통 게임 대회, 독립선언문 낭독'
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
        date: '9월 7일',
        event: '브라질 독립기념일',
        countries: ['brazil'],
        type: 'national',
        description: '포르투갈로부터의 독립을 기념하는 국경일',
        culturalNotes: '군사 퍼레이드, 삼바 댄스, 축구 경기 관람'
      },
      {
        date: '9월 중순',
        event: '추석 (중추절)',
        countries: ['china', 'vietnam'],
        type: 'traditional',
        description: '달을 보며 가족이 모이는 전통 명절',
        culturalNotes: '월병 먹기, 등불 축제, 달 구경'
      },
      {
        date: '9월 16일',
        event: '멕시코 독립기념일',
        countries: ['mexico'],
        type: 'national',
        description: '스페인으로부터의 독립을 기념하는 국경일',
        culturalNotes: '국기 3색 장식, 마리아치 음악, 전통 무용'
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
        date: '10월 3일',
        event: '독일 통일의 날',
        countries: ['germany'],
        type: 'national',
        description: '동서독 통일을 기념하는 독일의 국경일',
        culturalNotes: '베를린 축제, 독일 국기 게양, 통일 기념 행사'
      },
      {
        date: '10월 12일',
        event: '콜럼버스 데이',
        countries: ['usa', 'spain', 'italy'],
        type: 'historical',
        description: '콜럼버스의 아메리카 대륙 발견을 기념',
        culturalNotes: '역사 교육 프로그램, 탐험 정신 기념'
      },
      {
        date: '10월 중순',
        event: '디왈리 (빛의 축제)',
        countries: ['india', 'nepal'],
        type: 'religious',
        description: '힌두교 최대 축제로 선악의 승리를 기념',
        culturalNotes: '등불 장식, 폭죽, 과자 나눠먹기'
      },
      {
        date: '10월 31일',
        event: '할로윈',
        countries: ['usa', 'canada', 'ireland'],
        type: 'traditional',
        description: '켈트족의 고대 축제에서 유래한 서구 전통 행사',
        culturalNotes: '가장행렬, 호박 등불, 사탕 나누기'
      }
    ]
  },
  11: { // 11월
    events: [
      {
        date: '11월 1일',
        event: '죽은 자의 날 (디아 데 무에르토스)',
        countries: ['mexico'],
        type: 'traditional',
        description: '멕시코의 전통 명절로 조상을 기리는 날',
        culturalNotes: '해골 장식, 마리골드 꽃, 조상 제단 꾸미기'
      },
      {
        date: '11월 9일',
        event: '네팔 헌법의 날',
        countries: ['nepal'],
        type: 'national',
        description: '네팔 헌법 제정을 기념하는 국경일',
        culturalNotes: '국기 게양, 문화 행사'
      },
      {
        date: '11월 11일',
        event: '현충일 (서구)',
        countries: ['usa', 'canada', 'france'],
        type: 'national',
        description: '전쟁에서 희생된 군인들을 기리는 날',
        culturalNotes: '양귀비 꽃 패용, 묵념, 국가 행사'
      },
      {
        date: '11월 넷째 목요일',
        event: '추수감사절',
        countries: ['usa', 'canada'],
        type: 'traditional',
        description: '가족이 모여 한 해 수확에 감사하는 미국 전통 명절',
        culturalNotes: '칠면조 요리, 가족 모임, 감사 인사'
      }
    ]
  },
  12: { // 12월
    events: [
      {
        date: '12월 6일',
        event: '성 니콜라스 데이',
        countries: ['germany', 'poland', 'romania'],
        type: 'religious',
        description: '성 니콜라스를 기념하며 선물을 주고받는 유럽 전통 축제',
        culturalNotes: '신발에 선물 넣기, 어린이들을 위한 축제'
      },
      {
        date: '12월 13일',
        event: '성 루시아 축제',
        countries: ['sweden', 'norway', 'finland'],
        type: 'traditional',
        description: '북유럽의 빛의 축제로 긴 겨울밤을 밝히는 전통 행사',
        culturalNotes: '흰 옷과 촛불, 루시아 행렬, 전통 노래'
      },
      {
        date: '12월 21일',
        event: '동지 축제 (유즈)',
        countries: ['iran', 'tajikistan', 'uzbekistan'],
        type: 'traditional',
        description: '페르시아 문화권의 동지 축제로 빛의 승리를 기념',
        culturalNotes: '밤새 불 지피기, 수박과 견과류 먹기, 시 낭송'
      },
      {
        date: '12월 25일',
        event: '크리스마스',
        countries: ['philippines', 'russia', 'ethiopia', 'poland'],
        type: 'religious',
        description: '예수 그리스도의 탄생을 기념하는 기독교 명절',
        culturalNotes: '미사, 선물 교환, 가족 모임, 크리스마스 캐럴'
      },
      {
        date: '12월 26일',
        event: '복싱 데이',
        countries: ['australia', 'canada', 'new_zealand'],
        type: 'traditional',
        description: '영연방 국가의 전통 명절로 선물 상자를 여는 날',
        culturalNotes: '가족과 함께 여유로운 시간, 쇼핑 세일'
      },
      {
        date: '12월 31일',
        event: '신정 (새해맞이)',
        countries: ['russia', 'thailand', 'vietnam', 'brazil'],
        type: 'international',
        description: '새해를 맞이하는 세계적 축제일',
        culturalNotes: '카운트다운, 불꽃놀이, 새해 결심, 파티'
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