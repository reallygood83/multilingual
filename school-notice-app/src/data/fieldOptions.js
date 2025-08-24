// 한국 초중고등학교에서 자주 사용되는 실제적인 선택지 데이터

export const FIELD_OPTIONS = {
  // === 행사 관련 선택지 ===
  eventName: [
    { value: '체육대회', label: '체육대회', icon: '🏃‍♂️' },
    { value: '학예회', label: '학예회', icon: '🎭' },
    { value: '현장체험학습', label: '현장체험학습', icon: '🚌' },
    { value: '학부모 참관 수업', label: '학부모 참관 수업', icon: '👨‍👩‍👧‍👦' },
    { value: '운동회', label: '운동회', icon: '🏆' },
    { value: '과학 축제', label: '과학 축제', icon: '🔬' },
    { value: '독서 발표회', label: '독서 발표회', icon: '📚' },
    { value: '합창 대회', label: '합창 대회', icon: '🎵' },
    { value: '미술 전시회', label: '미술 전시회', icon: '🎨' },
    { value: '학급 발표회', label: '학급 발표회', icon: '🎤' },
    { value: '졸업식', label: '졸업식', icon: '🎓' },
    { value: '입학식', label: '입학식', icon: '🌸' },
    { value: '학부모 총회', label: '학부모 총회', icon: '💼' }
  ],

  eventLocation: [
    { value: '학교 운동장', label: '학교 운동장', icon: '🏃‍♂️' },
    { value: '체육관', label: '체육관', icon: '🏟️' },
    { value: '강당', label: '강당', icon: '🎭' },
    { value: '음악실', label: '음악실', icon: '🎵' },
    { value: '미술실', label: '미술실', icon: '🎨' },
    { value: '과학실', label: '과학실', icon: '🔬' },
    { value: '컴퓨터실', label: '컴퓨터실', icon: '💻' },
    { value: '도서관', label: '도서관', icon: '📚' },
    { value: '각 교실', label: '각 교실', icon: '🏫' },
    { value: '시청각실', label: '시청각실', icon: '📺' },
    { value: '운동장', label: '운동장', icon: '⚽' },
    { value: '학습원 견학지', label: '학습원 견학지', icon: '🚌' },
    { value: '박물관', label: '박물관', icon: '🏛️' },
    { value: '과학관', label: '과학관', icon: '🔬' }
  ],

  targetParticipants: [
    { value: '전교생', label: '전교생', icon: '👥' },
    { value: '1-3학년', label: '1-3학년', icon: '🧒' },
    { value: '4-6학년', label: '4-6학년', icon: '👦👧' },
    { value: '1학년', label: '1학년', icon: '1️⃣' },
    { value: '2학년', label: '2학년', icon: '2️⃣' },
    { value: '3학년', label: '3학년', icon: '3️⃣' },
    { value: '4학년', label: '4학년', icon: '4️⃣' },
    { value: '5학년', label: '5학년', icon: '5️⃣' },
    { value: '6학년', label: '6학년', icon: '6️⃣' },
    { value: '전교생 및 학부모', label: '전교생 및 학부모', icon: '👨‍👩‍👧‍👦' },
    { value: '학부모님', label: '학부모님', icon: '👨‍👩‍👧' },
    { value: '희망 학생', label: '희망 학생', icon: '🙋‍♂️' }
  ],

  requiredItems: [
    { value: '편한 복장', label: '편한 복장', icon: '👕' },
    { value: '운동화', label: '운동화', icon: '👟' },
    { value: '체육복', label: '체육복', icon: '👔' },
    { value: '돗자리', label: '돗자리', icon: '🧺' },
    { value: '물병', label: '물병', icon: '💧' },
    { value: '간식', label: '간식', icon: '🍎' },
    { value: '우산', label: '우산', icon: '☔' },
    { value: '필기구', label: '필기구', icon: '✏️' },
    { value: '공책', label: '공책', icon: '📓' },
    { value: '도시락', label: '도시락', icon: '🍱' },
    { value: '수건', label: '수건', icon: '🤧' },
    { value: '응원 도구', label: '응원 도구', icon: '📣' },
    { value: '카메라', label: '카메라', icon: '📷' },
    { value: '실내화', label: '실내화', icon: '🥿' },
    { value: '방석', label: '방석', icon: '💺' }
  ],

  // === 학부모 참여 관련 선택지 ===
  participationTopic: [
    { value: '학급 봉사활동', label: '학급 봉사활동', icon: '🤝' },
    { value: '교육 프로그램 지원', label: '교육 프로그램 지원', icon: '📚' },
    { value: '행사 도우미', label: '행사 도우미', icon: '🙋‍♀️' },
    { value: '재능기부', label: '재능기부', icon: '🎁' },
    { value: '학습 지원', label: '학습 지원', icon: '📝' },
    { value: '안전 지도', label: '안전 지도', icon: '🚸' },
    { value: '환경 정리', label: '환경 정리', icon: '🧹' },
    { value: '급식 도우미', label: '급식 도우미', icon: '🍽️' },
    { value: '독서 활동 지원', label: '독서 활동 지원', icon: '📖' },
    { value: '체험 활동 인솔', label: '체험 활동 인솔', icon: '👨‍🏫' }
  ],

  participationMethod: [
    { value: '온라인 참여', label: '온라인 참여', icon: '💻' },
    { value: '오프라인 참여', label: '오프라인 참여', icon: '🏫' },
    { value: '자료 제출', label: '자료 제출', icon: '📄' },
    { value: '전화 상담', label: '전화 상담', icon: '📞' },
    { value: '방문 상담', label: '방문 상담', icon: '🚪' },
    { value: '설문 참여', label: '설문 참여', icon: '📝' },
    { value: '회의 참석', label: '회의 참석', icon: '💼' },
    { value: '워크샵 참여', label: '워크샵 참여', icon: '🛠️' }
  ],

  // === 교육 관련 선택지 ===
  educationTopic: [
    { value: '독서 습관 기르기', label: '독서 습관 기르기', icon: '📚' },
    { value: '바른 인성 기르기', label: '바른 인성 기르기', icon: '😊' },
    { value: '학습 습관 형성', label: '학습 습관 형성', icon: '✏️' },
    { value: '건강한 생활습관', label: '건강한 생활습관', icon: '💪' },
    { value: '예절 교육', label: '예절 교육', icon: '🙏' },
    { value: '환경 보호', label: '환경 보호', icon: '🌱' },
    { value: '디지털 시민의식', label: '디지털 시민의식', icon: '📱' },
    { value: '창의성 개발', label: '창의성 개발', icon: '🎨' },
    { value: '협동심 기르기', label: '협동심 기르기', icon: '🤝' },
    { value: '자기주도 학습', label: '자기주도 학습', icon: '🎯' }
  ],

  safetyTopic: [
    { value: '교통안전 교육', label: '교통안전 교육', icon: '🚦' },
    { value: '화재 예방 교육', label: '화재 예방 교육', icon: '🔥' },
    { value: '성폭력 예방 교육', label: '성폭력 예방 교육', icon: '🛡️' },
    { value: '학교폭력 예방', label: '학교폭력 예방', icon: '🤝' },
    { value: '인터넷 안전', label: '인터넷 안전', icon: '💻' },
    { value: '약물 오남용 예방', label: '약물 오남용 예방', icon: '💊' },
    { value: '재해 대응', label: '재해 대응', icon: '🌪️' },
    { value: '응급처치', label: '응급처치', icon: '🏥' },
    { value: '개인정보 보호', label: '개인정보 보호', icon: '🔒' },
    { value: '사이버 폭력 예방', label: '사이버 폭력 예방', icon: '📱' }
  ],

  guidanceTopic: [
    { value: '스마트폰 사용 습관', label: '스마트폰 사용 습관', icon: '📱' },
    { value: '학습 태도 개선', label: '학습 태도 개선', icon: '📚' },
    { value: '친구 관계 개선', label: '친구 관계 개선', icon: '👫' },
    { value: '규칙 준수', label: '규칙 준수', icon: '📋' },
    { value: '시간 관리', label: '시간 관리', icon: '⏰' },
    { value: '감정 조절', label: '감정 조절', icon: '😌' },
    { value: '책임감 기르기', label: '책임감 기르기', icon: '🎯' },
    { value: '정리정돈 습관', label: '정리정돈 습관', icon: '🧹' },
    { value: '예의범절', label: '예의범절', icon: '🙏' },
    { value: '자기 표현', label: '자기 표현', icon: '🗣️' }
  ],

  // === 기본 정보 선택지 ===
  grade: [
    { value: '1', label: '1학년', icon: '1️⃣' },
    { value: '2', label: '2학년', icon: '2️⃣' },
    { value: '3', label: '3학년', icon: '3️⃣' },
    { value: '4', label: '4학년', icon: '4️⃣' },
    { value: '5', label: '5학년', icon: '5️⃣' },
    { value: '6', label: '6학년', icon: '6️⃣' }
  ],

  classNumber: [
    { value: '1', label: '1반', icon: '🅰️' },
    { value: '2', label: '2반', icon: '🅱️' },
    { value: '3', label: '3반', icon: '🇨' },
    { value: '4', label: '4반', icon: '🇩' },
    { value: '5', label: '5반', icon: '🇪' },
    { value: '6', label: '6반', icon: '🇫' },
    { value: '7', label: '7반', icon: '🇬' },
    { value: '8', label: '8반', icon: '🇭' }
  ],

  semester: [
    { value: '2025년 1학기', label: '2025년 1학기', icon: '🌸' },
    { value: '2025년 2학기', label: '2025년 2학기', icon: '🍂' },
    { value: '2024년 1학기', label: '2024년 1학기', icon: '🌸' },
    { value: '2024년 2학기', label: '2024년 2학기', icon: '🍂' }
  ],

  targetAge: [
    { value: '유치원생', label: '유치원생', icon: '🧒' },
    { value: '초등학교 1-2학년', label: '초등학교 1-2학년', icon: '👶' },
    { value: '초등학교 3-4학년', label: '초등학교 3-4학년', icon: '🧑' },
    { value: '초등학교 5-6학년', label: '초등학교 5-6학년', icon: '👦👧' },
    { value: '중학교 1-3학년', label: '중학교 1-3학년', icon: '👨‍🎓' },
    { value: '고등학교 1-3학년', label: '고등학교 1-3학년', icon: '👩‍🎓' }
  ],

  duration: [
    { value: '1주간', label: '1주간', icon: '📅' },
    { value: '2주간', label: '2주간', icon: '📅' },
    { value: '3주간', label: '3주간', icon: '📅' },
    { value: '4주간', label: '4주간', icon: '📅' },
    { value: '1개월', label: '1개월', icon: '🗓️' },
    { value: '2개월', label: '2개월', icon: '🗓️' },
    { value: '한 학기', label: '한 학기', icon: '📚' },
    { value: '1년간', label: '1년간', icon: '📖' }
  ]
};

// 날짜 입력이 필요한 필드들
export const DATE_FIELDS = [
  'eventDate',
  'evaluationPeriod',
  'participationPeriod'
];

// 다중 선택이 가능한 필드들
export const MULTI_SELECT_FIELDS = [
  'requiredItems',
  'homeActivities',
  'riskFactors',
  'preventionRules'
];