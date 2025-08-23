import { translateWithGemini } from './geminiService';

/**
 * 전문적인 AI 통신문 마법사 서비스
 * 연구조사를 바탕으로 한 교사 전문성 반영 통신문 생성
 */

// 학교급별 맞춤형 카테고리 및 전문 프롬프트 템플릿
const PROFESSIONAL_CATEGORY_PROMPTS = {
  // 성적 통지 및 개별 피드백
  individual_feedback: {
    name: '개별 학생 성적통지표 가정통신문',
    description: '개별 학생의 성장과 발달을 담은 맞춤형 통신문',
    template: `당신은 20년 경력의 전문 교사입니다. 다음 정보를 바탕으로 개별 학생을 위한 따뜻하고 전문적인 가정통신문을 작성해주세요.

학생 정보:
- 학생명: {studentName}
- 학급: {grade}학년 {classNumber}반
- 평가 기간: {evaluationPeriod}

학생 특성 및 성장 내용:
- 학습 태도: {learningAttitude}
- 성격 및 특성: {personalityTraits}
- 학업 성취: {academicAchievement}
- 교우 관계: {peerRelationship}
- 특별 활동: {specialActivities}
- 개선이 필요한 부분: {improvementAreas}

다음 구조로 작성하되, 교사의 따뜻함과 전문성이 드러나도록 해주세요:

1. **정중한 인사 (3-4줄)**
   - "안녕하십니까? {grade}학년 {classNumber}반 담임 교사입니다."
   - 계절감이나 시기적 상황을 자연스럽게 언급
   - 학부모님께 감사 인사

2. **학생 개별 관찰 및 성장 스토리 (8-12줄)**
   - 구체적인 에피소드나 관찰 내용 포함
   - "○○이는 ~한 모습을 보여주고 있습니다" 형태의 서술
   - 긍정적 변화와 성장 포인트 강조
   - 학습 태도, 성격, 교우 관계의 균형있는 서술

3. **학업 성취 및 발전 방향 (5-7줄)**
   - 구체적인 교과별 성취 상황
   - 노력한 부분에 대한 인정과 격려
   - 앞으로의 발전 가능성 제시

4. **가정과의 협력 요청 (3-5줄)**
   - 구체적이고 실행 가능한 협력 방안
   - 학생의 특성에 맞는 맞춤형 조언
   - 격려 위주의 긍정적 표현

5. **따뜻한 마무리 (2-3줄)**
   - 학생에 대한 애정과 믿음 표현
   - 가정의 건강과 행복을 기원하는 인사

**작성 원칙:**
- 학생의 이름을 자연스럽게 3-4회 언급
- 구체적인 행동이나 상황을 예시로 제시
- '~습니다', '~입니다' 존대법 일관 사용
- 부정적 표현보다는 발전 가능성으로 전환하여 표현
- 학부모가 자녀를 더 이해할 수 있도록 도움이 되는 내용 포함
- 교사로서의 따뜻한 마음과 전문적 관찰력이 드러나도록 작성

전체 분량: 15-20줄 내외로 작성해주세요.`
  },

  // 학기말 종합 통신문
  semester_summary: {
    name: '학기말 종합 가정통신문',
    description: '한 학기를 마무리하는 종합적인 학급 통신문',
    template: `당신은 경험 많은 교사로서 한 학기를 마무리하며 학급 전체 학부모님께 보내는 따뜻한 통신문을 작성해주세요.

학급 정보:
- 학급: {grade}학년 {classNumber}반
- 학기: {semester}
- 주요 활동: {majorActivities}
- 학급 특성: {classCharacteristics}
- 성과 및 성장: {achievements}
- 감사 인사 대상: {gratitudeTargets}

다음 구조로 작성해주세요:

1. **계절감 있는 인사 (4-5줄)**
   - 계절의 변화와 시간의 흐름을 자연스럽게 언급
   - 한 학기 동안의 소감을 담은 따뜻한 인사
   - 학부모님의 지원에 대한 감사

2. **학급의 성장 스토리 (10-12줄)**
   - 학기 초와 현재의 변화된 모습 비교
   - 구체적인 학급 활동과 에피소드 소개
   - 아이들의 개별적, 집단적 성장 사례
   - "처음에는... 이제는..." 형태의 대비 표현 활용

3. **교육활동 성과 및 특별한 순간들 (6-8줄)**
   - 주요 교육활동과 그 의미
   - 기억에 남는 특별한 순간들
   - 아이들이 보여준 감동적인 모습들

4. **학부모님께 감사 인사 (4-5줄)**
   - 구체적인 협력 사례에 대한 감사
   - 아이들 양육에 대한 인정과 격려
   - 가정과 학교의 협력 가치 강조

5. **앞으로의 다짐과 기원 (3-4줄)**
   - 새 학기나 방학에 대한 기대와 당부
   - 건강과 행복에 대한 기원
   - 지속적인 관심과 협력 부탁

**작성 원칙:**
- 감정이 풍부하면서도 품격 있는 문체
- 구체적인 에피소드로 생생함 더하기
- 교사로서의 보람과 감동이 자연스럽게 드러나도록
- 학부모와 학생 모두를 아우르는 따뜻한 시선
- 격식을 갖추면서도 친근한 어조

전체 분량: 25-30줄 내외로 작성해주세요.`
  },

  // 행사 안내 통신문
  event_announcement: {
    name: '학교 행사 안내 통신문',
    description: '학교 행사에 대한 전문적이고 상세한 안내',
    template: `교육 전문가로서 학부모님들께 학교 행사를 안내하는 공식적이면서도 따뜻한 통신문을 작성해주세요.

행사 정보:
- 행사명: {eventName}
- 일시: {eventDate}
- 장소: {eventLocation}
- 대상: {targetParticipants}
- 목적 및 의미: {eventPurpose}
- 준비물: {requiredItems}
- 일정표: {eventSchedule}
- 주의사항: {precautions}
- 참여 방법: {participationMethod}

다음 구조로 작성해주세요:

1. **정중한 인사 및 행사 소개 (4-5줄)**
   - 계절이나 시기에 맞는 자연스러운 인사
   - 행사명과 개최 취지 간략 소개
   - 학부모님의 지속적인 관심에 감사

2. **행사의 교육적 의미와 가치 (6-7줄)**
   - 행사가 학생들에게 주는 교육적 효과
   - 성장과 발달에 미치는 긍정적 영향
   - 공동체 의식이나 협력 정신 함양 측면
   - 학부모 참여의 의미와 중요성

3. **구체적인 행사 정보 (8-10줄)**
   - 일시, 장소, 대상을 명확하게 명시
   - 상세한 일정과 프로그램 소개
   - 준비물과 복장에 대한 구체적 안내
   - 교통편이나 주차 관련 정보 포함

4. **참여 방법 및 협조 요청사항 (5-6줄)**
   - 참여 신청 방법과 마감일
   - 학부모님께 당부하고 싶은 사항
   - 안전 관련 주의사항
   - 궁금한 점 문의 방법

5. **따뜻한 마무리 (3-4줄)**
   - 많은 참여를 당부하는 정중한 요청
   - 가족 모두의 건강과 행복 기원
   - 행사 성공을 위한 협력 감사

**작성 원칙:**
- 공식적이면서도 친근한 어조 유지
- 교육적 가치와 의미를 자연스럽게 강조
- 구체적이고 명확한 정보 제공
- 학부모의 입장을 고려한 배려 있는 표현
- 행사에 대한 기대감과 참여 의욕 고취

전체 분량: 25-28줄 내외로 작성해주세요.`
  },

  // 가정 연계 교육 안내
  home_education_guide: {
    name: '가정 연계 교육 안내문',
    description: '가정에서의 교육 협력을 위한 전문적 가이드',
    template: `교육 전문가로서 가정에서의 교육 활동에 대해 구체적이고 실용적인 가이드를 제공하는 통신문을 작성해주세요.

교육 주제:
- 주제명: {educationTopic}
- 교육 목표: {educationGoals}
- 대상 연령: {targetAge}
- 기간: {duration}
- 가정에서 할 수 있는 활동: {homeActivities}
- 주의사항: {precautions}
- 기대 효과: {expectedOutcomes}

다음 구조로 작성해주세요:

1. **교육적 인사말 (4-5줄)**
   - 가정 교육의 중요성에 대한 언급
   - 학부모님의 교육 파트너로서의 역할 인정
   - 이번 주제 교육의 필요성 간략 소개

2. **교육 주제의 중요성과 목표 (7-8줄)**
   - 현재 시기 아이들에게 필요한 교육임을 강조
   - 구체적인 교육 목표와 기대 효과
   - 가정과 학교가 함께 할 때의 시너지 효과
   - 아이의 건강한 성장과 발달에 미치는 영향

3. **구체적인 가정 교육 방법 (12-15줄)**
   - 일상생활에서 쉽게 실천할 수 있는 방법들
   - 연령에 적합한 단계별 접근법
   - 구체적인 대화법이나 활동 예시
   - "예를 들어..." 형태로 실제 상황 제시
   - 부모의 역할과 아이의 반응에 대한 이해

4. **주의사항 및 도움 요청 (5-6줄)**
   - 교육 시 유의해야 할 점들
   - 아이의 개별 특성을 고려한 조언
   - 어려움이 있을 때의 대처 방법
   - 언제든 상담 가능함을 안내

5. **격려와 응원의 마무리 (3-4줄)**
   - 학부모님의 노력에 대한 격려
   - 아이들의 성장에 대한 긍정적 전망
   - 가정과 학교의 지속적 협력 당부

**작성 원칙:**
- 실용적이고 구체적인 방법 제시
- 교육학적 전문성이 드러나는 조언
- 학부모의 부담을 줄이는 현실적 접근
- 아이 중심의 발달 단계별 고려
- 따뜻하면서도 전문적인 어조

전체 분량: 30-35줄 내외로 작성해주세요.`
  },

  // 생활 지도 안내
  life_guidance: {
    name: '생활지도 협력 안내문',
    description: '학생 생활지도를 위한 가정-학교 협력 안내',
    template: `생활지도 전문가로서 학생들의 건전한 생활 습관 형성을 위한 가정과의 협력 방안을 제시하는 통신문을 작성해주세요.

지도 내용:
- 지도 주제: {guidanceTopic}
- 현재 상황: {currentSituation}
- 목표: {guidanceGoals}
- 구체적 방법: {specificMethods}
- 가정 협력 사항: {homeCooperation}
- 기대 효과: {expectedResults}

다음 구조로 작성해주세요:

1. **상황 인식과 공감 (5-6줄)**
   - 현재 아이들의 상황에 대한 이해와 공감
   - 시대적 환경 변화가 아이들에게 미치는 영향
   - 학부모님들의 고민과 걱정에 대한 이해
   - 함께 해결해 나가야 할 과제임을 강조

2. **생활지도의 교육적 의미 (6-7줄)**
   - 단순한 규제가 아닌 성장을 위한 지도임을 강조
   - 올바른 가치관과 판단력 형성의 중요성
   - 자율성과 책임감 발달에 미치는 영향
   - 미래 사회 구성원으로서 필요한 역량

3. **구체적인 지도 방법과 전략 (10-12줄)**
   - 학교에서 진행하고 있는 지도 방법 소개
   - 효과적인 지도를 위한 원칙과 방법
   - 아이들의 자발적 참여를 이끌어내는 방법
   - 긍정적 강화와 격려 중심의 접근
   - 개별 학생 특성을 고려한 맞춤형 지도

4. **가정에서의 협력 방안 (8-10줄)**
   - 가정에서 실천 가능한 구체적 방법들
   - 일관성 있는 지도를 위한 가정-학교 협력
   - 대화와 소통을 통한 이해와 공감 증진
   - 모범을 보이는 부모 역할의 중요성
   - 아이의 자존감을 높이는 방법

5. **지속적 소통과 격려 (4-5줄)**
   - 변화에는 시간이 필요함을 이해해 주실 것 당부
   - 작은 변화와 노력에 대한 인정과 격려 부탁
   - 언제든 상담하고 협력할 준비가 되어 있음을 안내
   - 아이들의 건강한 성장에 대한 믿음과 기대

**작성 원칙:**
- 비난이나 지적보다는 이해와 협력 중심
- 구체적이고 실천 가능한 방법 제시
- 아이들에 대한 사랑과 믿음이 바탕이 됨을 강조
- 학부모와 교사가 함께하는 동반자적 관계 강조
- 긍정적이고 희망적인 미래 전망 제시

전체 분량: 30-35줄 내외로 작성해주세요.`
  },

  // 안전 교육 통신문
  safety_education: {
    name: '안전 교육 안내문',
    description: '학생 안전을 위한 전문적이고 체계적인 안내',
    template: `안전 교육 전문가로서 학생들의 안전한 학교생활과 일상생활을 위한 종합적인 안전 교육 안내문을 작성해주세요.

안전 교육 정보:
- 교육 주제: {safetyTopic}
- 교육 배경: {educationBackground}
- 교육 내용: {educationContent}
- 실천 방법: {practicalMethods}
- 위험 요소: {riskFactors}
- 예방 수칙: {preventionRules}
- 비상시 대처법: {emergencyResponse}

다음 구조로 작성해주세요:

1. **안전의 중요성 강조 (5-6줄)**
   - 소중한 아이들의 안전이 최우선임을 강조
   - 예방의 중요성과 사전 교육의 필요성
   - 가정과 학교가 함께 만들어가는 안전한 환경
   - 작은 관심과 주의가 큰 사고를 예방함을 언급

2. **현재 안전 교육의 필요성 (7-8줄)**
   - 최근 안전 관련 상황이나 사회적 이슈 언급
   - 우리 아이들이 직면할 수 있는 위험 요소들
   - 체계적이고 지속적인 안전 교육의 중요성
   - 단순 지식 전달이 아닌 생활 속 실천 능력 기르기

3. **구체적인 안전 교육 내용 (12-15줄)**
   - 학교에서 실시하는 안전 교육 프로그램 소개
   - 각 상황별 구체적인 안전 수칙과 대처 방법
   - 아이들이 쉽게 이해하고 기억할 수 있는 방법
   - 실제 상황을 가정한 시뮬레이션 교육 내용
   - 또래들과 함께하는 협력적 안전 의식 기르기

4. **가정에서의 안전 교육 협력 (8-10줄)**
   - 일상생활에서 자연스럽게 안전 의식 기르기
   - 가족이 함께 안전 수칙 점검하고 실천하기
   - 아이와 함께하는 안전 관련 대화 방법
   - 위험 상황 발생 시 침착한 대처 능력 기르기
   - 정기적인 안전 점검과 환경 개선

5. **지속적 관심과 협력 당부 (4-5줄)**
   - 안전은 하루아침에 완성되지 않는 지속적 과제
   - 학부모님의 꾸준한 관심과 교육 부탁
   - 학교와 가정의 긴밀한 협력과 소통
   - 안전한 우리 아이들의 미래에 대한 확신

**작성 원칙:**
- 불안감을 주지 않으면서도 경각심 유발
- 구체적이고 실용적인 안전 수칙 제시
- 아이들 눈높이에 맞는 교육 방법 안내
- 가정에서 실천 가능한 현실적 방안 제공
- 안전에 대한 긍정적이고 적극적인 자세 강조

전체 분량: 35-40줄 내외로 작성해주세요.`
  }
};

// 학교급별 전문 문구 템플릿
const SCHOOL_LEVEL_EXPRESSIONS = {
  elementary: {
    greeting: [
      "안녕하십니까? 항상 따뜻한 관심으로 아이들을 지켜봐 주시는 학부모님들께 깊은 감사를 드립니다.",
      "사랑하는 우리 아이들과 함께하는 즐거운 학교생활 속에서 학부모님께 안부 말씀을 드립니다.",
      "아이들의 맑은 웃음소리가 가득한 교실에서 학부모님께 따뜻한 인사를 전해드립니다."
    ],
    student_reference: [
      "○○이는 늘 밝은 표정으로",
      "우리 ○○이가 보여주는",
      "○○이의 순수한 마음이",
      "○○이만의 특별한 모습을"
    ],
    encouragement: [
      "아이들의 무한한 가능성을 믿으며",
      "한 걸음 한 걸음 성장하는 모습이",
      "작은 변화 하나하나가 소중한",
      "꾸준한 노력이 만들어내는 기적을"
    ],
    closing: [
      "가정의 건강과 행복을 진심으로 기원합니다.",
      "항상 웃음이 가득한 행복한 가정 되시기를 바랍니다.",
      "가족 모두의 건강과 평안을 기도합니다."
    ]
  },
  middle: {
    greeting: [
      "안녕하십니까? 중학교 시기의 소중한 성장기를 함께 지켜보며 학부모님께 감사 인사를 드립니다.",
      "급변하는 사춘기 시기, 아이들과 함께 고민하고 성장하는 학부모님들께 깊은 존경을 표합니다.",
      "중학생이 되어 한층 성숙해져가는 아이들을 보며 학부모님께 안부를 여쭙습니다."
    ],
    student_reference: [
      "○○이가 중학생이 되면서 보여주는",
      "사춘기 시기임에도 불구하고 ○○이는",
      "○○이의 생각과 행동이",
      "점점 어른스러워지는 ○○이의"
    ],
    encouragement: [
      "이 시기의 혼란과 고민들이 모두 성장의 과정임을",
      "진정한 자아를 찾아가는 소중한 시간임을",
      "지금의 경험들이 미래의 밑거름이 될 것임을",
      "부모님의 사랑과 믿음이 가장 큰 힘이 됨을"
    ],
    closing: [
      "중학교 시기를 현명하게 극복해 나가시기를 응원합니다.",
      "아이와 함께 성장하는 지혜로운 가정이 되시기를 바랍니다.",
      "가족 간의 대화와 이해가 더욱 깊어지기를 기원합니다."
    ]
  },
  high: {
    greeting: [
      "안녕하십니까? 진로에 대한 진지한 고민과 함께 성인으로 성장해가는 시기에 학부모님께 인사드립니다.",
      "대학 진학과 미래 설계라는 중요한 시기에 아이들을 지켜봐 주시는 학부모님들께 감사드립니다.",
      "고등학교 시기의 치열한 경쟁 속에서도 인성을 잃지 않도록 지도해주시는 학부모님께 경의를 표합니다."
    ],
    student_reference: [
      "○○이가 고등학생으로서 보여주는",
      "진로에 대해 진지하게 고민하는 ○○이의",
      "성인이 되어가는 ○○이의 모습에서",
      "미래에 대한 꿈을 키워가는 ○○이는"
    ],
    encouragement: [
      "현재의 노력이 밝은 미래를 만들어갈 것임을",
      "꿈을 향한 도전 정신이 가장 소중함을",
      "실패와 좌절도 성장의 중요한 경험임을",
      "끝까지 포기하지 않는 의지가 성공의 열쇠임을"
    ],
    closing: [
      "꿈을 향한 아이들의 도전을 응원하며, 가정의 평안을 기원합니다.",
      "미래의 주역으로 성장할 아이들과 함께 하는 보람찬 나날 되시기를 바랍니다.",
      "입시의 부담 속에서도 건강하고 행복한 가정 되시기를 기도합니다."
    ]
  }
};

// 전문 문체 스타일 가이드
const PROFESSIONAL_STYLE_GUIDE = {
  formal_expressions: [
    "말씀드리고자 합니다",
    "안내해 드리겠습니다",
    "당부를 드리고 싶습니다",
    "협조를 부탁드립니다",
    "감사의 말씀을 전합니다"
  ],
  transition_phrases: [
    "또한",
    "더불어",
    "아울러",
    "특히",
    "무엇보다",
    "한편",
    "이와 함께"
  ],
  polite_endings: [
    "~하시기 바랍니다",
    "~해 주시면 감사하겠습니다",
    "~부탁드립니다",
    "~기원합니다",
    "~응원합니다"
  ]
};

/**
 * 전문적인 프롬프트 생성 함수
 */
function generateProfessionalPrompt(category, data, schoolLevel = 'elementary') {
  const categoryInfo = PROFESSIONAL_CATEGORY_PROMPTS[category];
  if (!categoryInfo) {
    throw new Error(`지원하지 않는 카테고리입니다: ${category}`);
  }

  let prompt = categoryInfo.template;
  
  // 기본 데이터 치환
  Object.keys(data).forEach(key => {
    const value = data[key] || '(정보 없음)';
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  // 학교급별 표현 가이드 추가
  const levelExpressions = SCHOOL_LEVEL_EXPRESSIONS[schoolLevel];
  if (levelExpressions) {
    prompt += `\n\n**학교급별 표현 가이드 (${schoolLevel}):**
**인사말 예시:** ${levelExpressions.greeting.join(' / ')}
**학생 언급 방식:** ${levelExpressions.student_reference.join(' / ')}
**격려 표현:** ${levelExpressions.encouragement.join(' / ')}
**마무리 인사:** ${levelExpressions.closing.join(' / ')}`;
  }

  // 전문 문체 가이드 추가
  prompt += `\n\n**전문 문체 가이드:**
**격식 있는 표현:** ${PROFESSIONAL_STYLE_GUIDE.formal_expressions.join(', ')}
**자연스러운 연결어:** ${PROFESSIONAL_STYLE_GUIDE.transition_phrases.join(', ')}
**정중한 마무리:** ${PROFESSIONAL_STYLE_GUIDE.polite_endings.join(', ')}

**최종 점검사항:**
1. 교사의 따뜻함과 전문성이 동시에 드러나는가?
2. 학부모가 읽었을 때 감동과 신뢰를 느낄 수 있는가?
3. 구체적이고 실용적인 내용이 포함되어 있는가?
4. 아이에 대한 애정과 교육적 관점이 잘 담겨있는가?
5. 문체가 일관되고 품격 있는가?`;

  return prompt;
}

/**
 * 전문적인 통신문 생성 메인 함수
 */
export async function generateProfessionalNotice(requestData, apiKeyOverride = undefined) {
  try {
    const { 
      category, 
      schoolLevel = 'elementary',
      ...restData 
    } = requestData;
    
    // 입력 데이터 검증
    if (!category) {
      throw new Error('카테고리 정보가 필요합니다.');
    }

    // API 키 검증
    const apiKey = apiKeyOverride || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Gemini API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.');
    }

    // 전문 프롬프트 생성
    const prompt = generateProfessionalPrompt(category, restData, schoolLevel);

    // AI를 통한 전문 통신문 생성
    const generatedContent = await translateWithGemini(prompt, 'ko', apiKey);
    
    if (!generatedContent || generatedContent.trim().length === 0) {
      throw new Error('AI가 통신문을 생성하지 못했습니다.');
    }

    // 고품질 HTML 변환
    const htmlContent = convertToProfessionalHTML(generatedContent);

    return {
      success: true,
      data: {
        introText: PROFESSIONAL_CATEGORY_PROMPTS[category].name,
        content: htmlContent,
        category: PROFESSIONAL_CATEGORY_PROMPTS[category].name,
        description: PROFESSIONAL_CATEGORY_PROMPTS[category].description,
        schoolLevel: schoolLevel,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('전문 통신문 생성 중 오류:', error);
    
    // 더 친화적인 에러 메시지 제공
    let userMessage = '전문 통신문 생성 중 오류가 발생했습니다.';
    
    if (error.message?.includes('API key') || error.message?.includes('Invalid API key')) {
      userMessage = 'Gemini API 키가 유효하지 않거나 설정되지 않았습니다. 설정에서 올바른 API 키를 확인해주세요.';
    } else if (error.message?.includes('quota') || error.message?.includes('429')) {
      userMessage = 'API 사용 한도를 초과했습니다. 잠시 후 다시 시도해주거나 다른 시간에 이용해주세요.';
    } else if (error.message?.includes('network') || error.message?.includes('connection') || error.message?.includes('fetch')) {
      userMessage = '네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.';
    } else if (error.message?.includes('rate limit')) {
      userMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.message?.includes('timeout')) {
      userMessage = '응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    } else {
      userMessage = error.message || '전문 통신문 생성 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
    
    return {
      success: false,
      error: userMessage
    };
  }
}

/**
 * 전문적인 HTML 변환 함수
 */
function convertToProfessionalHTML(text) {
  if (!text) return '';
  
  let html = text.replace(/\n/g, '<br>');
  
  // 제목 패턴 (1., 2., 3. 또는 **제목** 형식)
  html = html.replace(/^(\d+\.\s*\*\*.*?\*\*)/gm, '<h3 class="notice-section-title">$1</h3>');
  html = html.replace(/^\*\*(.*?)\*\*/gm, '<h3 class="notice-section-title">$1</h3>');
  
  // 강조 표시
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="notice-emphasis">$1</strong>');
  
  // 번호 목록 (1. 2. 3. 형식)
  html = html.replace(/^(\d+\.)\s*([^<\n]*?)(?=<br>|$)/gm, 
    '<p class="notice-list-item"><span class="notice-list-number">$1</span> $2</p>');
  
  // 불릿 포인트 (- 또는 • 형식)
  html = html.replace(/^[•\-]\s*([^<\n]*?)(?=<br>|$)/gm, 
    '<p class="notice-bullet-item"><span class="notice-bullet">•</span> $1</p>');
  
  // 단락 정리
  html = html.replace(/<br><br>/g, '</p><p>');
  
  // 전체를 컨테이너로 감싸기
  if (!html.startsWith('<')) {
    html = '<div class="professional-notice-content"><p>' + html + '</p></div>';
  } else {
    html = '<div class="professional-notice-content">' + html + '</div>';
  }
  
  return html;
}

/**
 * 전문 카테고리 목록 반환
 */
export function getProfessionalCategories() {
  return Object.keys(PROFESSIONAL_CATEGORY_PROMPTS).map(key => ({
    id: key,
    name: PROFESSIONAL_CATEGORY_PROMPTS[key].name,
    description: PROFESSIONAL_CATEGORY_PROMPTS[key].description
  }));
}

/**
 * 카테고리별 필수 입력 필드 반환
 */
export function getCategoryRequiredFields(categoryId) {
  const fieldMapping = {
    individual_feedback: ['studentName', 'grade', 'classNumber', 'evaluationPeriod', 'learningAttitude', 'personalityTraits'],
    semester_summary: ['grade', 'classNumber', 'semester', 'majorActivities', 'classCharacteristics'],
    event_announcement: ['eventName', 'eventDate', 'eventLocation', 'eventPurpose'],
    home_education_guide: ['educationTopic', 'educationGoals', 'targetAge', 'homeActivities'],
    life_guidance: ['guidanceTopic', 'currentSituation', 'guidanceGoals', 'specificMethods'],
    safety_education: ['safetyTopic', 'educationBackground', 'educationContent', 'preventionRules']
  };
  
  return fieldMapping[categoryId] || [];
}

/**
 * 학교급별 맞춤 문구 반환
 */
export function getSchoolLevelExpressions(schoolLevel) {
  return SCHOOL_LEVEL_EXPRESSIONS[schoolLevel] || SCHOOL_LEVEL_EXPRESSIONS.elementary;
}