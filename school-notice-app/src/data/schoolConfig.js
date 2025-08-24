// 학교 정보 기본 설정 및 자동완성 데이터

// 기본 학교 정보 (설정에서 변경 가능)
export const DEFAULT_SCHOOL_CONFIG = {
  schoolName: '○○초등학교',
  schoolAddress: '서울시 ○○구 ○○동 ○○○번지',
  schoolPhone: '02-000-0000',
  schoolWebsite: 'www.school.go.kr',
  principalName: '○○○',
  vicePrincipalName: '○○○',
  schoolMotto: '꿈과 희망이 자라는 행복한 학교'
};

// 한국 주요 도시별 학교 정보 자동완성 데이터
export const SCHOOL_SUGGESTIONS = {
  // 서울특별시
  seoul: {
    districts: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', 
              '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', 
              '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', 
              '종로구', '중구', '중랑구'],
    phonePrefix: '02',
    schools: [
      { name: '서울○○초등학교', type: '초등학교' },
      { name: '서울○○중학교', type: '중학교' },
      { name: '서울○○고등학교', type: '고등학교' }
    ]
  },
  
  // 부산광역시
  busan: {
    districts: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', 
              '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
    phonePrefix: '051',
    schools: [
      { name: '부산○○초등학교', type: '초등학교' },
      { name: '부산○○중학교', type: '중학교' },
      { name: '부산○○고등학교', type: '고등학교' }
    ]
  },
  
  // 경기도
  gyeonggi: {
    districts: ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', 
              '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', 
              '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', 
              '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군'],
    phonePrefix: '031',
    schools: [
      { name: '○○초등학교', type: '초등학교' },
      { name: '○○중학교', type: '중학교' },
      { name: '○○고등학교', type: '고등학교' }
    ]
  }
};

// 학교 유형별 설정
export const SCHOOL_TYPES = {
  elementary: {
    name: '초등학교',
    grades: [1, 2, 3, 4, 5, 6],
    suffix: '초등학교',
    icon: '🎒'
  },
  middle: {
    name: '중학교',
    grades: [1, 2, 3],
    suffix: '중학교',
    icon: '📚'
  },
  high: {
    name: '고등학교',
    grades: [1, 2, 3],
    suffix: '고등학교',
    icon: '🎓'
  }
};

// 통신문 발신처 정보 템플릿
export const SENDER_TEMPLATES = {
  teacher: {
    title: '담임교사',
    signature: '{{schoolName}} {{grade}}학년 {{class}}반 담임교사 {{teacherName}}'
  },
  principal: {
    title: '교장',
    signature: '{{schoolName}} 교장 {{principalName}}'
  },
  vicePrincipal: {
    title: '교감',
    signature: '{{schoolName}} 교감 {{vicePrincipalName}}'
  },
  school: {
    title: '학교',
    signature: '{{schoolName}}'
  }
};

// 연락처 정보 템플릿
export const CONTACT_TEMPLATES = [
  {
    type: 'school_main',
    label: '학교 대표번호',
    template: '{{schoolPhone}}'
  },
  {
    type: 'teacher_office',
    label: '교무실',
    template: '{{schoolPhone}} (교무실)'
  },
  {
    type: 'administrative_office',
    label: '행정실',
    template: '{{schoolPhone}} (행정실)'
  },
  {
    type: 'health_office',
    label: '보건실',
    template: '{{schoolPhone}} (보건실)'
  }
];

// 학교 정보 자동 감지 함수
export const detectSchoolInfo = (schoolName) => {
  if (!schoolName) return DEFAULT_SCHOOL_CONFIG;
  
  let detectedInfo = { ...DEFAULT_SCHOOL_CONFIG };
  
  // 학교명에서 지역 정보 추출
  for (const [region, info] of Object.entries(SCHOOL_SUGGESTIONS)) {
    if (schoolName.includes(region) || schoolName.includes(info.districts[0])) {
      detectedInfo.schoolPhone = `${info.phonePrefix}-000-0000`;
      break;
    }
  }
  
  // 학교 유형 감지
  for (const [type, config] of Object.entries(SCHOOL_TYPES)) {
    if (schoolName.includes(config.suffix)) {
      detectedInfo.schoolType = type;
      break;
    }
  }
  
  return detectedInfo;
};

// 학교 정보 자동완성 함수
export const getSchoolSuggestions = (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const suggestions = [];
  
  // 모든 지역의 학교 데이터에서 검색
  for (const [region, info] of Object.entries(SCHOOL_SUGGESTIONS)) {
    // 지역명 매칭
    if (region.includes(searchTerm.toLowerCase()) || 
        info.districts.some(district => district.includes(searchTerm))) {
      suggestions.push(...info.schools.map(school => ({
        ...school,
        region,
        fullName: school.name.replace('○○', searchTerm)
      })));
    }
  }
  
  return suggestions.slice(0, 10); // 최대 10개까지
};