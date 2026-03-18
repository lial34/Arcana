import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Moon, Star, Sun, Sparkles, ChevronLeft, Info, BookOpen, Send, RefreshCw } from 'lucide-react';

const TARO_CARDS = [
	{ id: 'm0', num: '0', name: 'The Fool', type: 'Major', symbol: '✧', message: '두려움 없는 순수한 발걸음이 새로운 길을 만듭니다.', keywords: ['자유', '시작', '순수', '모험'], desc: '새로운 여정의 시작을 알리는 카드입니다. 미지의 세계를 향해 나아가세요.' },
	{ id: 'm1', num: 'I', name: 'The Magician', type: 'Major', symbol: '☿', message: '당신 안에 잠든 무한한 창조의 가능성을 믿으세요.', keywords: ['창조', '능력', '자신감', '실행력'], desc: '당신은 필요한 모든 도구를 이미 갖추고 있습니다. 의지력을 발휘할 때입니다.' },
	{ id: 'm2', num: 'II', name: 'The High Priestess', type: 'Major', symbol: '☾', message: '침묵 속에서 들려오는 내면의 목소리에 집중하세요.', keywords: ['직관', '무의식', '지혜', '신비'], desc: '겉으로 드러나지 않은 진실이 당신의 직관을 통해 밝혀질 것입니다.' },
	{ id: 'm3', num: 'III', name: 'The Empress', type: 'Major', symbol: '♀', message: '따스한 대지의 기운이 당신의 삶을 풍요롭게 채웁니다.', keywords: ['풍요', '모성', '창의성', '결실'], desc: '비옥한 대지처럼 풍요로운 에너지가 흐릅니다. 결실을 맺을 준비가 되었습니다.' },
	{ id: 'm4', num: 'IV', name: 'The Emperor', type: 'Major', symbol: '♂', message: '확고한 의지와 질서가 당신의 왕국을 견고히 합니다.', keywords: ['권위', '질서', '구조', '보호'], desc: '리더십과 질서가 필요한 시기입니다. 체계적인 계획을 통해 상황을 통제하세요.' },
	{ id: 'm5', num: 'V', name: 'The Hierophant', type: 'Major', symbol: '♃', message: '전통의 지혜가 당신의 혼란스러운 마음을 가이드합니다.', keywords: ['교훈', '전통', '믿음', '동료애'], desc: '보편적인 진리와 조언자의 지혜를 따르는 것이 좋은 결과를 가져옵니다.' },
	{ id: 'm6', num: 'VI', name: 'The Lovers', type: 'Major', symbol: '♎', message: '마음의 끌림을 따라 조화로운 결단을 내릴 시간입니다.', keywords: ['사랑', '선택', '결합', '조화'], desc: '중요한 선택의 기로에 서 있습니다. 당신의 마음이 향하는 곳을 따르세요.' },
	{ id: 'm7', num: 'VII', name: 'The Chariot', type: 'Major', symbol: '♋', message: '어떤 장애물도 당신의 불타는 추진력을 막지 못합니다.', keywords: ['승리', '의지', '돌파', '목표의식'], desc: '강한 통제력과 의지로 승리를 쟁취할 때입니다. 뒤돌아보지 말고 전진하세요.' },
	{ id: 'm8', num: 'VIII', name: 'Strength', type: 'Major', symbol: '♌', message: '부드러운 용기가 가장 강인한 야수마저 길들입니다.', keywords: ['인내', '용기', '내면의 힘', '통제'], desc: '외적인 힘보다 내면의 인내와 친절이 더 큰 승리를 가져다줍니다.' },
	{ id: 'm9', num: 'IX', name: 'The Hermit', type: 'Major', symbol: '♍', message: '고독 속에서 빛나는 당신만의 진실을 찾아보세요.', keywords: ['성찰', '탐구', '고독', '진리'], desc: '외부 세계에서 벗어나 내면을 살피는 정적의 시간이 필요합니다.' },
	{ id: 'm10', num: 'X', name: 'Wheel of Fortune', type: 'Major', symbol: '⚙', message: '거대한 운명의 수레바퀴가 당신을 향해 돌기 시작합니다.', keywords: ['운명', '변화', '기회', '터닝포인트'], desc: '당신의 힘으로 어찌할 수 없는 필연적인 변화와 행운이 다가오고 있습니다.' },
	{ id: 'm11', num: 'XI', name: 'Justice', type: 'Major', symbol: '♎', message: '균형 잡힌 시각이 당신을 올바른 정의로 인도합니다.', keywords: ['정의', '공정', '원인과결과', '결단'], desc: '감정을 배제하고 객관적인 사실에 입각하여 판단해야 하는 시기입니다.' },
	{ id: 'm12', num: 'XII', name: 'The Hanged Man', type: 'Major', symbol: '♓', message: '거꾸로 보는 세상 속에서 비로소 새로운 답을 얻습니다.', keywords: ['희생', '새로운시각', '정지', '깨달음'], desc: '조급함을 버리고 상황을 다른 각도에서 바라보세요. 비움이 곧 채움입니다.' },
	{ id: 'm13', num: 'XIII', name: 'Death', type: 'Major', symbol: '♏', message: '낡은 허물을 벗어야 비로소 새로운 생명이 잉태됩니다.', keywords: ['종결', '변화', '새로운시작', '이별'], desc: '두려워하지 마세요. 하나의 끝은 더 나은 시작을 위한 필수적인 과정입니다.' },
	{ id: 'm14', num: 'XIV', name: 'Temperance', type: 'Major', symbol: '♐', message: '서로 다른 두 물줄기가 만나 완벽한 조화를 이룹니다.', keywords: ['절제', '조화', '균형', '정화'], desc: '중용의 미덕을 발휘하여 극단을 피하고 조화로운 합의점을 찾으세요.' },
	{ id: 'm15', num: 'XV', name: 'The Devil', type: 'Major', symbol: '♑', message: '유혹의 사슬을 끊는 열쇠는 이미 당신 손에 쥐어져 있습니다.', keywords: ['속박', '유혹', '집착', '물질적욕망'], desc: '자신을 옭아매고 있는 집착이 무엇인지 직면하고 자유를 되찾으세요.' },
	{ id: 'm16', num: 'XVI', name: 'The Tower', type: 'Major', symbol: '⚡', message: '견고했던 탑이 무너진 자리 위로 진실의 빛이 쏟아집니다.', keywords: ['충격', '급격한변화', '파괴', '진실의폭로'], desc: '예상치 못한 변화가 닥칠 수 있으나, 이는 거짓된 기반을 허무는 과정입니다.' },
	{ id: 'm17', num: 'XVII', name: 'The Star', type: 'Major', symbol: '♒', message: '어두운 밤하늘을 수놓은 별들이 당신의 희망이 됩니다.', keywords: ['희망', '영감', '치유', '낙관주의'], desc: '길었던 어둠이 걷히고 희망의 별이 뜹니다. 우주의 에너지를 믿고 나아가세요.' },
	{ id: 'm18', num: 'XVIII', name: 'The Moon', type: 'Major', symbol: '🌙', message: '안개 속 모호함은 당신의 무의식이 건네는 신비한 대화입니다.', keywords: ['혼란', '불안', '환상', '잠재력'], desc: '직관을 믿되 환상에 빠지지 마세요. 내면의 두려움을 직면할 때입니다.' },
	{ id: 'm19', num: 'XIX', name: 'The Sun', type: 'Major', symbol: '☀', message: '환한 태양처럼 당신의 삶에 눈부신 축복이 가득합니다.', keywords: ['성공', '활력', '기쁨', '명확함'], desc: '모든 것이 명확해지고 활력이 넘칩니다. 당신의 앞날이 태양처럼 밝습니다.' },
	{ id: 'm20', num: 'XX', name: 'Judgement', type: 'Major', symbol: '🎺', message: '새로운 소명이 당신의 영혼을 깨우는 나팔소리를 울립니다.', keywords: ['부활', '결단', '해방', '새로운소명'], desc: '과거를 딛고 일어서야 할 때입니다. 새로운 변화의 부름에 응답하세요.' },
	{ id: 'm21', num: 'XXI', name: 'The World', type: 'Major', symbol: '🌍', message: '마침내 완성된 당신의 세계가 우주와 하나가 됩니다.', keywords: ['완성', '통합', '성취', '여행'], desc: '하나의 주기가 완성되었습니다. 성취를 만끽하고 새로운 도약을 준비하세요.' },

	// Minor Arcana
	{ id: 'm22', num: 'Wand I', name: 'Ace of Wands', type: 'Minor', symbol: '⚚', message: '새로운 열정의 불꽃이 당신의 길을 밝힙니다.', keywords: ['시작', '에너지', '영감', '창의성'], desc: '무언가 새로운 일을 시작할 강력한 동기부여와 창조적인 에너지가 솟구치는 시기입니다.' },
	{ id: 'm23', num: 'Wand II', name: 'Two of Wands', type: 'Minor', symbol: '⚚', message: '이미 얻은 성취를 넘어 더 큰 세계를 바라보세요.', keywords: ['계획', '결정', '확장', '전망'], desc: '성공적인 첫발을 딛고 다음 단계로 나아가기 위해 세계를 조망하며 계획을 세우는 단계입니다.' },
	{ id: 'm24', num: 'Wand III', name: 'Three of Wands', type: 'Minor', symbol: '⚚', message: '당신의 비전이 수평선 너머 새로운 기회를 불러옵니다.', keywords: ['탐험', '협력', '무역', '자신감'], desc: '준비된 계획이 실행에 옮겨졌으며, 더 넓은 시장이나 미지의 영역에서 성과가 오기를 기다리는 모습입니다.' },
	{ id: 'm25', num: 'Wand IV', name: 'Four of Wands', type: 'Minor', symbol: '⚚', message: '평화로운 안식처에서 거둔 결실을 축하할 시간입니다.', keywords: ['축제', '안정', '화합', '휴식'], desc: '일시적인 목표 달성을 축하하며 가족이나 동료들과 기쁨을 나누는 평온하고 행복한 시기입니다.' },
	{ id: 'm26', num: 'Wand V', name: 'Five of Wands', type: 'Minor', symbol: '⚚', message: '치열한 경쟁 속에서 당신의 역량을 증명해 보세요.', keywords: ['갈등', '경쟁', '혼란', '투쟁'], desc: '주변과의 사소한 다툼이나 경쟁이 발생할 수 있으나, 이는 성장을 위한 자극제가 될 것입니다.' },
	{ id: 'm27', num: 'Wand VI', name: 'Six of Wands', type: 'Minor', symbol: '⚚', message: '당당한 승전보가 당신의 명예를 드높입니다.', keywords: ['승리', '성공', '인정', '자부심'], desc: '어려움을 극복하고 마침내 승리하여 주변 사람들로부터 찬사와 인정을 받게 되는 카드입니다.' },
	{ id: 'm28', num: 'Wand VII', name: 'Seven of Wands', type: 'Minor', symbol: '⚚', message: '밀려드는 도전에 맞서 당신의 자리를 굳건히 지키세요.', keywords: ['방어', '용기', '저항', '유지'], desc: '유리한 위치를 선점했으나 이를 시기하는 도전들이 많습니다. 용기를 내어 끝까지 방어해야 합니다.' },
	{ id: 'm29', num: 'Wand VIII', name: 'Eight of Wands', type: 'Minor', symbol: '⚚', message: '정체되었던 상황이 화살처럼 빠르게 진전됩니다.', keywords: ['속도', '진전', '소식', '이동'], desc: '지연되었던 일들이 급물살을 타며 빠르게 해결되거나 예상치 못한 좋은 소식이 날아듭니다.' },
	{ id: 'm30', num: 'Wand IX', name: 'Nine of Wands', type: 'Minor', symbol: '⚚', message: '마지막 고비를 넘기기 위해 인내의 끈을 조이세요.', keywords: ['경계', '인내', '준비', '회복력'], desc: '지친 상태이지만 거의 다 왔습니다. 마지막 장애물을 경계하며 끝까지 버티는 끈기가 필요합니다.' },
	{ id: 'm31', num: 'Wand X', name: 'Ten of Wands', type: 'Minor', symbol: '⚚', message: '무거운 책임감의 끝에서 목표가 머지않았습니다.', keywords: ['부담', '책임', '과부하', '완수'], desc: '혼자서 너무 많은 짐을 지고 있습니다. 힘들더라도 목표 지점이 코앞이니 조금만 더 힘을 내세요.' },
	{ id: 'm32', num: 'Wand Page', name: 'Page of Wands', type: 'Minor', symbol: '⚚', message: '순수한 열정의 전령이 새로운 소식을 가져옵니다.', keywords: ['호기심', '소식', '열정', '탐구'], desc: '새로운 가능성에 눈을 뜨고 이를 배우고자 하는 순수하고 열정적인 에너지가 가득합니다.' },
	{ id: 'm33', num: 'Wand Knight', name: 'Knight of Wands', type: 'Minor', symbol: '⚚', message: '불꽃 같은 기세로 목적지를 향해 거침없이 돌진하세요.', keywords: ['추진력', '모험', '성급함', '실행'], desc: '생각보다 행동이 앞서는 시기입니다. 넘치는 활력으로 상황을 빠르게 주도해 나갑니다.' },
	{ id: 'm34', num: 'Wand Queen', name: 'Queen of Wands', type: 'Minor', symbol: '⚚', message: '따뜻한 카리스마가 주변을 활기차게 변화시킵니다.', keywords: ['자신감', '친절', '매력', '독립적'], desc: '밝고 긍정적인 에너지로 주변을 이끄는 리더십을 발휘하며 자신의 일을 멋지게 해냅니다.' },
	{ id: 'm35', num: 'Wand King', name: 'King of Wands', type: 'Minor', symbol: '⚚', message: '확고한 비전과 통찰력이 성공의 지도를 그려냅니다.', keywords: ['리더십', '권위', '통제', '비전'], desc: '풍부한 경험과 결단력을 바탕으로 거대한 프로젝트나 상황을 완벽하게 통제하고 성공시킵니다.' },

	// Minor Arcana - Cups (m36 ~ m49)
	{ id: 'm36', num: 'Cup I', name: 'Ace of Cups', type: 'Minor', symbol: '🍷', message: '넘쳐흐르는 감정의 샘에서 진정한 사랑이 시작됩니다.', keywords: ['사랑', '기쁨', '영성', '평화'], desc: '마음의 평화와 새로운 인간관계, 혹은 깊은 감정적 만족감이 찾아오는 축복의 시기입니다.' },
	{ id: 'm37', num: 'Cup II', name: 'Two of Cups', type: 'Minor', symbol: '🍷', message: '서로의 잔을 나누며 조화로운 교감을 시작하세요.', keywords: ['결합', '우정', '파트너십', '화합'], desc: '마음이 맞는 상대와 깊은 유대감을 형성하거나 평등하고 조화로운 계약이 성사됩니다.' },
	{ id: 'm38', num: 'Cup III', name: 'Three of Cups', type: 'Minor', symbol: '🍷', message: '함께 나누는 기쁨이 당신의 삶을 더욱 풍요롭게 합니다.', keywords: ['축하', '커뮤니티', '우정', '결실'], desc: '친구들이나 동료들과 함께 성과를 축하하며 즐거운 시간을 보내는 화기애애한 시기입니다.' },
	{ id: 'm39', num: 'Cup IV', name: 'Four of Cups', type: 'Minor', symbol: '🍷', message: '외부의 제안보다 내면의 권태를 먼저 살펴보세요.', keywords: ['권태', '명상', '불만족', '정체'], desc: '주어지는 기회에 무관심하거나 지루함을 느끼고 있습니다. 내면을 환기할 시간이 필요합니다.' },
	{ id: 'm40', num: 'Cup V', name: 'Five of Cups', type: 'Minor', symbol: '🍷', message: '엎질러진 잔 뒤에 여전히 남은 희망을 바라보세요.', keywords: ['상실', '후회', '슬픔', '희망'], desc: '잃어버린 것에 집착하여 슬픔에 잠겨 있으나, 아직 당신 뒤에는 소중한 것들이 남아있음을 잊지 마세요.' },
	{ id: 'm41', num: 'Cup VI', name: 'Six of Cups', type: 'Minor', symbol: '🍷', message: '그리운 기억의 향기가 지친 마음을 따뜻하게 안아줍니다.', keywords: ['추억', '순수', '재회', '선물'], desc: '과거의 순수했던 시절을 떠올리거나 그리운 사람으로부터 소식을 듣게 되어 마음이 치유됩니다.' },
	{ id: 'm42', num: 'Cup VII', name: 'Seven of Cups', type: 'Minor', symbol: '🍷', message: '수많은 환상 속에서 당신의 진심을 담은 하나를 고르세요.', keywords: ['환상', '선택', '상상력', '혼란'], desc: '수많은 가능성과 유혹 앞에 서 있습니다. 겉모습에 속지 말고 실질적인 선택을 내려야 합니다.' },
	{ id: 'm43', num: 'Cup VIII', name: 'Eight of Cups', type: 'Minor', symbol: '🍷', message: '미련을 뒤로하고 더 높은 진리를 찾아 떠날 때입니다.', keywords: ['이동', '포기', '내면의탐구', '변화'], desc: '감정적인 만족이 다하지 않았음에도 불구하고, 더 큰 성장을 위해 현재를 떠나 새로운 길로 향합니다.' },
	{ id: 'm44', num: 'Cup IX', name: 'Nine of Cups', type: 'Minor', symbol: '🍷', message: '당신이 바랐던 소망이 마침내 현실이 되어 돌아옵니다.', keywords: ['만족', '소원성취', '행복', '성공'], desc: '감정적, 물질적으로 매우 만족스러운 상태입니다. 소망하던 일이 이루어져 기쁨을 만끽합니다.' },
	{ id: 'm45', num: 'Cup X', name: 'Ten of Cups', type: 'Minor', symbol: '🍷', message: '무지개 아래 온 가족의 웃음소리가 가득 울려 퍼집니다.', keywords: ['가족애', '완성', '조화', '행복'], desc: '감정적 완성의 정점입니다. 주변 사람들과의 관계가 완벽하게 화합하며 행복의 절정에 다다릅니다.' },
	{ id: 'm46', num: 'Cup Page', name: 'Page of Cups', type: 'Minor', symbol: '🍷', message: '감수성 풍부한 마음이 새로운 예술적 영감을 불러옵니다.', keywords: ['영감', '감수성', '직관', '친절'], desc: '뜻밖의 감동적인 소식을 접하거나 창의적인 아이디어가 떠오르는 순수한 시기입니다.' },
	{ id: 'm47', num: 'Cup Knight', name: 'Knight of Cups', type: 'Minor', symbol: '🍷', message: '낭만적인 전령이 당신의 마음을 흔들 제안을 가져옵니다.', keywords: ['제안', '낭만', '이상주의', '매력'], desc: '부드럽고 매력적인 제안이 찾아옵니다. 자신의 감정을 솔직하게 표현하고 전달하기 좋은 때입니다.' },
	{ id: 'm48', num: 'Cup Queen', name: 'Queen of Cups', type: 'Minor', symbol: '🍷', message: '깊은 바다와 같은 공감 능력이 상처받은 마음을 치유합니다.', keywords: ['공감', '치유', '모성애', '신비'], desc: '타인의 마음을 깊이 이해하고 보듬어주는 시기입니다. 자신의 직관이 매우 날카로워져 있습니다.' },
	{ id: 'm49', num: 'Cup King', name: 'King of Cups', type: 'Minor', symbol: '🍷', message: '감정의 파도를 다스리는 평온한 지혜가 빛을 발합니다.', keywords: ['평정심', '자제력', '관용', '성숙'], desc: '격렬한 감정의 변화 속에서도 중심을 잃지 않고 냉철하고 따뜻하게 상황을 조율해 나갑니다.' },

	// Minor Arcana - Swords (m50 ~ m63)
	{ id: 'm50', num: 'Sword I', name: 'Ace of Swords', type: 'Minor', symbol: '⚔️', message: '명확한 논리가 복잡한 안개를 단칼에 걷어냅니다.', keywords: ['승리', '돌파', '명확함', '지성'], desc: '객관적인 판단력과 강한 정신력으로 문제를 해결하고 새로운 진실을 마주하게 됩니다.' },
	{ id: 'm51', num: 'Sword II', name: 'Two of Swords', type: 'Minor', symbol: '⚔️', message: '팽팽한 대립 속에서 균형을 잡고 결단을 준비하세요.', keywords: ['막막함', '선택의기회', '균형', '정체'], desc: '두 가지 선택지 사이에서 고민하며 눈을 가리고 있는 상태입니다. 조만간 결단을 내려야 합니다.' },
	{ id: 'm52', num: 'Sword III', name: 'Three of Swords', type: 'Minor', symbol: '⚔️', message: '비 온 뒤 땅이 굳어지듯, 아픔 뒤에 성장이 찾아옵니다.', keywords: ['비탄', '이별', '상처', '진실'], desc: '마음 아픈 소식이나 이별이 있을 수 있으나, 이는 성장을 위해 거쳐야 할 정화의 과정입니다.' },
	{ id: 'm53', num: 'Sword IV', name: 'Four of Swords', type: 'Minor', symbol: '⚔️', message: '치열한 전투를 잠시 멈추고 영혼의 휴식을 허락하세요.', keywords: ['휴식', '회복', '명상', '정지'], desc: '더 나아가기 위해 반드시 필요한 멈춤입니다. 지친 몸과 마음을 정비하며 기력을 회복하세요.' },
	{ id: 'm54', num: 'Sword V', name: 'Five of Swords', type: 'Minor', symbol: '⚔️', message: '상처뿐인 승리보다 가치 있는 양보를 생각할 때입니다.', keywords: ['패배감', '비겁함', '불화', '공허한승리'], desc: '수단과 방법을 가리지 않은 승리는 오히려 적을 만들고 마음을 공허하게 할 뿐입니다.' },
	{ id: 'm55', num: 'Sword VI', name: 'Six of Swords', type: 'Minor', symbol: '⚔️', message: '격랑의 시기를 지나 고요한 치유의 땅으로 나아갑니다.', keywords: ['회복', '이동', '도움', '점진적변화'], desc: '힘든 시기를 뒤로하고 점차 상황이 나아지고 있습니다. 조력자의 도움을 받아 안전한 곳으로 향합니다.' },
	{ id: 'm56', num: 'Sword VII', name: 'Seven of Swords', type: 'Minor', symbol: '⚔️', message: '정면 돌파보다 지혜로운 전략과 신중함이 필요합니다.', keywords: ['책략', '은밀함', '기만', '지혜'], desc: '모든 것을 드러내기보다 전략적으로 움직여야 할 때입니다. 주변의 속임수도 경계해야 합니다.' },
	{ id: 'm57', num: 'Sword VIII', name: 'Eight of Swords', type: 'Minor', symbol: '⚔️', message: '당신을 옭아맨 포박은 사실 스스로 만든 환상입니다.', keywords: ['제약', '고립', '무기력', '출구'], desc: '사방이 막힌 것 같지만 실제로는 빠져나갈 틈이 있습니다. 스스로 만든 공포에서 벗어나세요.' },
	{ id: 'm58', num: 'Sword IX', name: 'Nine of Swords', type: 'Minor', symbol: '⚔️', message: '어두운 밤의 불안은 해가 뜨면 사라질 안개와 같습니다.', keywords: ['악몽', '불안', '불면', '죄책감'], desc: '일어나지 않은 일에 대한 과도한 걱정으로 고통받고 있습니다. 실체 없는 불안에서 깨어나야 합니다.' },
	{ id: 'm59', num: 'Sword X', name: 'Ten of Swords', type: 'Minor', symbol: '⚔️', message: '고통의 끝에서 비로소 새로운 아침의 서광이 비칩니다.', keywords: ['종결', '바닥', '배신', '새로운시작'], desc: '더 이상 나빠질 수 없는 최악의 상황이 끝났습니다. 이제 다시 일어서는 일만 남았습니다.' },
	{ id: 'm60', num: 'Sword Page', name: 'Page of Swords', type: 'Minor', symbol: '⚔️', message: '날카로운 관찰력으로 주변의 변화를 예의주시하세요.', keywords: ['기민함', '경계', '정보', '정신적민첩함'], desc: '호기심과 경계심을 동시에 품고 상황을 분석합니다. 새로운 정보나 소식에 귀를 기울이세요.' },
	{ id: 'm61', num: 'Sword Knight', name: 'Knight of Swords', type: 'Minor', symbol: '⚔️', message: '번뜩이는 지혜의 칼을 들고 목표를 향해 격렬하게 돌진하세요.', keywords: ['추진력', '직설적', '용기', '지적투쟁'], desc: '생각이 정리되면 망설임 없이 돌파해 나갑니다. 다만 독단적인 태도는 주의가 필요합니다.' },
	{ id: 'm62', num: 'Sword Queen', name: 'Queen of Swords', type: 'Minor', symbol: '⚔️', message: '냉철한 판단력과 엄격한 정의가 진실의 길을 엽니다.', keywords: ['냉철함', '독립적', '지혜', '직설적'], desc: '감정에 휘둘리지 않고 객관적인 사실에 입각하여 상황을 판단하고 독립적인 길을 걷습니다.' },
	{ id: 'm63', num: 'Sword King', name: 'King of Swords', type: 'Minor', symbol: '⚔️', message: '법과 원칙을 다스리는 지고의 지성이 세상을 조율합니다.', keywords: ['논리', '원칙', '권위', '냉정함'], desc: '질서와 공정함을 바탕으로 상황을 통제합니다. 냉정한 판단력이 필요한 중요한 결단에 유리합니다.' },

	// Minor Arcana - Pentacles (m64 ~ m77)
	{ id: 'm64', num: 'Pentacle I', name: 'Ace of Pentacles', type: 'Minor', symbol: '❂', message: '현실적인 풍요의 씨앗이 당신의 손바닥 위에 놓입니다.', keywords: ['번영', '기회', '안정', '실질적성과'], desc: '금전적인 행운이나 새로운 사업적 기회, 혹은 현실적인 이득이 시작되는 아주 좋은 징조입니다.' },
	{ id: 'm65', num: 'Pentacle II', name: 'Two of Pentacles', type: 'Minor', symbol: '❂', message: '변화하는 상황 속에서 유연한 균형 감각을 발휘하세요.', keywords: ['조절', '융통성', '우선순위', '균형'], desc: '두 가지 일을 동시에 병행하거나 재정 상태를 조율해야 하는 시기입니다. 유연함이 핵심입니다.' },
	{ id: 'm66', num: 'Pentacle III', name: 'Three of Pentacles', type: 'Minor', symbol: '❂', message: '협동과 기술의 조화가 완벽한 건축물을 세웁니다.', keywords: ['협력', '숙련', '팀워크', '인정'], desc: '서로 다른 분야의 전문가들과 힘을 합쳐 결과물을 만들어내며 자신의 능력을 인정받습니다.' },
	{ id: 'm67', num: 'Pentacle IV', name: 'Four of Pentacles', type: 'Minor', symbol: '❂', message: '안정을 지키려는 마음이 때로는 변화를 가로막습니다.', keywords: ['소유욕', '인색함', '안정', '보수적'], desc: '현재 가진 것을 잃지 않으려 방어적입니다. 안정도 중요하지만 과한 집착은 흐름을 방해합니다.' },
	{ id: 'm68', num: 'Pentacle V', name: 'Five of Pentacles', type: 'Minor', symbol: '❂', message: '추위 속에서도 서로를 의지하며 고난의 터널을 지나세요.', keywords: ['결핍', '상실', '어려움', '동반자'], desc: '금전적이나 정신적으로 힘든 시기입니다. 하지만 혼자가 아니니 서로 의지하며 이겨내야 합니다.' },
	{ id: 'm69', num: 'Pentacle VI', name: 'Six of Pentacles', type: 'Minor', symbol: '❂', message: '나눔과 베풂의 미덕이 선순환의 에너지를 만듭니다.', keywords: ['관용', '자선', '보상', '공평'], desc: '준 만큼 돌려받거나, 혹은 누군가에게 베풀 기회가 생깁니다. 재정적 흐름이 원활해지는 시기입니다.' },
	{ id: 'm70', num: 'Pentacle VII', name: 'Seven of Pentacles', type: 'Minor', symbol: '❂', message: '수확의 계절을 앞두고 정성을 다해 기다림을 배우세요.', keywords: ['인내', '투자', '중간점검', '보상'], desc: '이미 씨앗은 뿌려졌습니다. 결과가 나올 때까지 조급해하지 말고 차분히 기다리며 점검할 때입니다.' },
	{ id: 'm71', num: 'Pentacle VIII', name: 'Eight of Pentacles', type: 'Minor', symbol: '❂', message: '성실한 장인의 마음가짐이 명작을 빚어냅니다.', keywords: ['숙련', '열정', '디테일', '반복적노력'], desc: '자신의 분야에서 묵묵히 실력을 쌓아가는 시기입니다. 꾸준한 노력이 결국 큰 가치를 만듭니다.' },
	{ id: 'm72', num: 'Pentacle IX', name: 'Nine of Pentacles', type: 'Minor', symbol: '❂', message: '우아하고 평화로운 정원에서 풍요의 결실을 만끽하세요.', keywords: ['자립', '성공', '사치', '물질적안정'], desc: '주변의 도움 없이 스스로 이뤄낸 성과를 즐깁니다. 경제적으로 매우 여유롭고 품격 있는 상태입니다.' },
	{ id: 'm73', num: 'Pentacle X', name: 'Ten of Pentacles', type: 'Minor', symbol: '❂', message: '대를 이어 전해질 견고한 왕국이 완성되었습니다.', keywords: ['전통', '가문', '부유함', '영속성'], desc: '개인의 성취를 넘어 가족 전체나 조직의 번영으로 이어지는 완벽하고 영구적인 성공을 뜻합니다.' },
	{ id: 'm74', num: 'Pentacle Page', name: 'Page of Pentacles', type: 'Minor', symbol: '❂', message: '현실적인 목표를 향한 신중한 첫걸음을 내딛으세요.', keywords: ['연구', '신중함', '기회', '학습'], desc: '작지만 확실한 기회가 찾아옵니다. 차근차근 배우고 실천하며 미래를 설계하기 좋은 때입니다.' },
	{ id: 'm75', num: 'Pentacle Knight', name: 'Knight of Pentacles', type: 'Minor', symbol: '❂', message: '느리지만 확실한 발걸음이 가장 안전한 목적지에 닿습니다.', keywords: ['책임감', '성실', '안전', '인내'], desc: '속도보다 정확성을 중시합니다. 변함없는 성실함으로 신뢰를 쌓으며 목표를 완수합니다.' },
	{ id: 'm76', num: 'Pentacle Queen', name: 'Queen of Pentacles', type: 'Minor', symbol: '❂', message: '풍요로운 대지처럼 주변을 보살피는 넉넉함이 돋보입니다.', keywords: ['현실적', '자비', '양육', '실용주의'], desc: '정신적, 물질적 풍요를 모두 갖추고 주변 사람들을 따뜻하고 현실적으로 돌봐주는 시기입니다.' },
	{ id: 'm77', num: 'Pentacle King', name: 'King of Pentacles', type: 'Minor', symbol: '❂', message: '성공의 정점에서 세상을 다스리는 든든한 힘을 발휘하세요.', keywords: ['번영', '수완', '실질적권위', '결실'], desc: '물질적인 세계에서 가장 큰 성공을 거둔 상태입니다. 확고한 재력과 지위를 바탕으로 안정감을 줍니다.' },
];

const Navigation = ({ setView }) => (
	<nav className="fixed top-0 w-full z-[70] px-4 sm:px-6 md:px-8 lg:px-16 py-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
		<div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
			<div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-transform group-hover:scale-110">
				<Moon size={18} className="text-white" fill="white" />
			</div>
			<span className="text-xl font-serif tracking-[0.25em] text-white/90 uppercase">Arcana</span>
		</div>
		<div className="flex gap-10 text-[10px] uppercase tracking-[0.4em] font-medium items-center">
			<span className="text-purple-400 cursor-pointer border-b border-purple-400/50 pb-1" onClick={() => setView('home')}>Oracle</span>
			<span className="text-white/30 hover:text-white transition-colors cursor-pointer">Archive</span>
			<span className="text-white/30 hover:text-white transition-colors cursor-pointer">Journal</span>
		</div>
	</nav>
);

const SplashView = ({ isTransitioning, splashContainer }) => (
	<div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-transform duration-1000 ease-in-out ${isTransitioning ? '-translate-y-full' : 'translate-y-0'}`}>
		<div ref={splashContainer} className="absolute inset-0 z-0 pointer-events-none" />
		<div className="relative z-10 w-full max-w-7xl px-8 md:px-24 flex justify-center md:justify-end pointer-events-none">
			<div className={`flex flex-col items-start transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} translate-x-10 md:mr-20`}>
				<h1 className="text-white text-7xl md:text-9xl font-serif tracking-[0.15em] drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]">ARCANA</h1>
				<div className="h-[1px] w-32 bg-gradient-to-r from-purple-500 to-transparent my-8" />
				<p className="text-purple-400/70 tracking-[0.7em] text-[10px] md:text-xs uppercase font-light">The Cosmos Within</p>
			</div>
		</div>
	</div>
);

const HomeView = ({ todayCard, setView }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className="animate-in fade-in duration-1000">
			<header className="relative min-h-[100vh] flex items-center justify-center pt-20 overflow-hidden">
				<div className={`fixed left-12 lg:left-24 top-[40%] -translate-y-1/2 w-64 z-30 transition-all duration-700 delay-100 pointer-events-none ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
					<div className="flex items-center gap-3 mb-6 text-purple-400/60 uppercase tracking-[0.3em] text-[10px] font-bold">
						<BookOpen size={14} /> <span>Intuition</span>
					</div>
					<h2 className="text-3xl font-serif mb-6 text-white/90 italic">{todayCard?.name}</h2>
					<p className="text-white/40 text-xs leading-relaxed mb-8 font-light tracking-wide">{todayCard?.desc}</p>
					<div className="flex flex-wrap gap-2">
						{todayCard?.keywords.map(kw => (
							<span key={kw} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] text-white/60 tracking-widest">#{kw}</span>
						))}
					</div>
				</div>

				<div className={`fixed right-12 lg:right-24 top-[40%] -translate-y-1/2 w-64 z-30 transition-all duration-700 delay-100 text-right pointer-events-none ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
					<div className="flex items-center justify-end gap-3 mb-6 text-indigo-400/60 uppercase tracking-[0.3em] text-[10px] font-bold">
						<span>Structure</span> <Info size={14} />
					</div>
					<div className="mb-10">
						<span className="text-5xl font-serif text-white/10 block mb-2">{todayCard?.num}</span>
						<span className="text-[10px] tracking-[0.5em] text-indigo-300 uppercase font-medium">Arcana Number</span>
					</div>
					<div className="space-y-4">
						<div className="py-4 border-b border-white/5">
							<span className="text-white/20 block text-[9px] tracking-widest mb-1 uppercase">Classification</span>
							<span className="text-white/70 text-sm tracking-widest uppercase">{todayCard?.type} Arcana</span>
						</div>
						<div className="py-4">
							<span className="text-white/20 block text-[9px] tracking-widest mb-1 uppercase">Element Control</span>
							<span className="text-white/70 text-sm tracking-widest uppercase">Ethereal</span>
						</div>
					</div>
				</div>

				<div className="relative z-20 flex flex-col items-center group transition-transform duration-700" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
					<div className={`w-64 h-[24rem] relative transition-all duration-1000 transform-style-3d group-hover:rotate-y-180 animate-float ${isHovered ? 'scale-110 shadow-[0_0_100px_rgba(139,92,246,0.1)]' : ''}`} style={{ perspective: '2000px' }}>
						<div className="relative w-full h-full transform-style-3d transition-transform duration-1000 group-hover:rotate-y-180">
							<div className="absolute inset-0 backface-hidden rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#0a0a12]">
								<div className="w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#1a1a3a_0%,_transparent_80%)]">
									<div className="w-40 h-40 rounded-full border border-white/5 flex items-center justify-center relative">
										<div className="absolute inset-0 border border-purple-500/20 rounded-full animate-ping-slow" />
										<Moon className="w-12 h-12 text-white/20" />
									</div>
								</div>
							</div>
							<div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#0a0a12] border border-white/20 shadow-[0_0_60px_rgba(139,92,246,0.15)] p-1">
								<div className="w-full h-full border border-white/5 rounded-xl bg-gradient-to-b from-[#12121e] to-[#050508] flex flex-col items-center justify-between py-12 px-6 text-white/90">
									<span className="text-[10px] font-bold tracking-[0.5em] uppercase text-purple-400/80">{todayCard?.type}</span>
									<div className="flex flex-col items-center">
										<span className="text-8xl mb-8 text-purple-50 text-glow font-serif">{todayCard?.symbol}</span>
										<h3 className="text-2xl font-serif uppercase tracking-[0.2em] text-center text-white/90">{todayCard?.name}</h3>
									</div>
									<div className="opacity-40 flex gap-2 text-purple-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-16 text-center h-12 relative">
						<p className="text-[10px] tracking-[0.6em] uppercase text-white/30 group-hover:opacity-0 transition-all duration-500 transform group-hover:-translate-y-4 font-light">Hover to Reveal Today's Fate</p>
						<div className="absolute inset-0 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0">
							<p className="text-[13px] tracking-[0.25em] text-purple-300 font-serif italic mb-2">{todayCard?.message}</p>
							<div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
						</div>
					</div>
				</div>

				<div className="absolute bottom-0 left-0 w-full h-[160px] z-[15] pointer-events-none">
					<div className="absolute inset-0 overflow-hidden">
						<div className="wave wave-primary"></div>
						<div className="wave wave-secondary"></div>
					</div>
				</div>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-[5]" />
			</header>

			<section className="relative z-20 bg-[#020202] py-48 px-12 overflow-hidden">
				<div className="absolute inset-0 galaxy-gradient pointer-events-none opacity-40"></div>
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
					<button onClick={() => setView('reading')} className="group relative p-16 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[3rem] hover:border-purple-500/30 transition-all duration-700 text-left overflow-hidden shadow-2xl">
						<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
						<div className="relative z-10">
							<span className="text-[10px] uppercase tracking-[0.5em] text-purple-400/50 mb-6 block font-bold">Singular Path</span>
							<h4 className="text-4xl font-serif mb-6 italic flex items-center gap-6">1장 뽑기 <ChevronLeft size={24} className="rotate-180 opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all duration-500" /></h4>
							<p className="text-white/30 font-light text-base max-w-[280px] leading-relaxed">복잡한 생각들을 정리하고 하나의 명확한 조언을 구합니다.</p>
						</div>
						<Sun className="absolute bottom-[-30px] right-[-30px] w-48 h-48 opacity-[0.02] group-hover:opacity-[0.1] transition-all duration-1000 rotate-12 group-hover:rotate-45" />
					</button>
					
					<button className="group relative p-16 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[3rem] hover:border-blue-500/30 transition-all duration-700 text-left overflow-hidden shadow-2xl opacity-50 cursor-not-allowed">
						<div className="relative z-10">
							<span className="text-[10px] uppercase tracking-[0.5em] text-blue-400/50 mb-6 block font-bold">Triple Flow (Soon)</span>
							<h4 className="text-4xl font-serif mb-6 italic flex items-center gap-6">3장 뽑기</h4>
							<p className="text-white/30 font-light text-base max-w-[280px] leading-relaxed">과거, 현재, 그리고 다가올 흐름을 읽는 깊은 통찰.</p>
						</div>
						<Moon className="absolute bottom-[-30px] right-[-30px] w-48 h-48 opacity-[0.01]" />
					</button>
				</div>
			</section>
		</div>
	);
};

const ReadingView = ({ setView }) => {
	const [step, setStep] = useState('input');
	const [question, setQuestion] = useState('');
	const [selectedCard, setSelectedCard] = useState(null);
	const [shuffling, setShuffling] = useState(false);

	const majorCards = TARO_CARDS.filter(card => card.type === 'Major');

	const handleStartShuffle = () => {
		if (!question.trim()) return;
		setStep('shuffle');
		setShuffling(true);
		setTimeout(() => {
			setShuffling(false);
			setStep('pick');
		}, 3500);
	};

	const handlePickCard = (card) => {
		setSelectedCard(card);
		setStep('result');
	};

	return (
		<div className="min-h-screen pt-32 pb-20 px-12 animate-in fade-in duration-700 bg-[#020202] relative overflow-hidden flex flex-col items-center">
			{/* Question Input Phase */}
			{step === 'input' && (
				<div className="max-w-3xl w-full text-center mt-20 animate-in">
					<div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-purple-500/5 border border-purple-500/20 mb-12">
						<Sparkles size={16} className="text-purple-400 animate-pulse" />
						<span className="text-[11px] tracking-[0.3em] text-purple-300 uppercase font-medium">Sacred Inquiry</span>
					</div>
					<h2 className="text-5xl font-serif italic mb-8 text-white/90">어떤 고민이 당신의 밤을<br/>밝히고 있나요?</h2>
					<p className="text-white/30 mb-16 text-sm font-light leading-relaxed">당신의 의식 속에 머무는 고민을 적어주세요.<br/>진심 어린 질문일수록 별들의 대답은 선명해집니다.</p>
					
					<div className="relative group max-w-xl mx-auto">
						<textarea 
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							placeholder="예: 다가올 새로운 프로젝트가 잘 될 수 있을까요?"
							className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 pt-10 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 transition-all duration-500 resize-none h-48 text-lg font-light leading-relaxed scrollbar-none"
						/>
						<button 
							onClick={handleStartShuffle}
							disabled={!question.trim()}
							className="absolute bottom-6 right-6 p-4 rounded-full bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-20 disabled:hover:bg-purple-600 transition-all group-hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/20"
						>
							<Send size={20} />
						</button>
					</div>
				</div>
			)}

			{step === 'shuffle' && (
				<div className="h-[60vh] w-full flex flex-col items-center justify-center animate-in">
					<div className="text-center mb-16 animate-pulse">
						<p className="text-[10px] tracking-[1em] text-purple-400 uppercase mb-4">Shuffling Destiny</p>
						<h3 className="text-2xl font-serif text-white/40 italic">운명의 가닥들을 엮는 중...</h3>
					</div>
					<div className="relative w-full overflow-hidden h-64 border-y border-white/5 bg-white/[0.01]">
						<div className="flex gap-6 absolute left-0 animate-infinite-scroll py-8">
							{[...majorCards, ...majorCards, ...majorCards].map((card, idx) => (
								<div key={idx} className="w-32 h-48 rounded-xl border border-white/10 bg-[#0a0a12] flex flex-col items-center justify-center shadow-lg">
									<Moon className="text-white/5 w-8 h-8" />
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{step === 'pick' && (
				<div className="w-full h-screen flex flex-col items-center justify-start animate-in overflow-hidden relative">
					<div className="text-center mt-20 mb-10 z-20">
						<h3 className="text-4xl font-serif text-white/90 italic mb-4">하나의 카드를 선택하세요</h3>
						<p className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-bold">당신의 무의식이 이끄는 곳에 해답이 있습니다</p>
					</div>
					
					<div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full h-[400px] flex justify-center items-end overflow-visible pointer-events-none">
						{majorCards.map((card, i) => {
							const total = majorCards.length;
							const index = i - (total - 1) / 2;
							const angle = index * 4.2;

							return (
								<div 
									key={`taro-final-${card.id}`}
									onClick={() => handlePickCard(card)}
									className="absolute cursor-pointer group transition-all duration-300 ease-out pointer-events-auto"
									style={{ 
										zIndex: i,
										width: '110px',
										height: '170px',
										transformOrigin: '50% 800px',
										transform: `translate(-50%, -380px) rotate(${angle}deg)`,
										left: '50%',
										bottom: '0'
									}}
								>
									<div className="w-full h-full rounded-xl border border-white/10 bg-gradient-to-b from-[#1a1a3a] to-[#050508] shadow-[-5px_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] group-hover:-translate-y-32 group-hover:scale-110 group-hover:border-purple-400 group-hover:z-[1000] transition-all duration-500 relative overflow-hidden flex items-center justify-center">
										<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
										<Moon className="w-8 h-8 text-white/5 group-hover:text-purple-400 transition-all" />
										<div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none" />
									</div>
								</div>
							);
						})}
					</div>
					
					<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent z-[60] pointer-events-none" />
				</div>
			)}

			{step === 'result' && selectedCard && (
				<div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-20 py-10 animate-in">
					{/* Result Card */}
					<div className="w-80 h-[28rem] flex-shrink-0 perspective-1000">
						<div className="w-full h-full rounded-3xl bg-[#0a0a12] border-2 border-purple-500/30 shadow-[0_0_80px_rgba(139,92,246,0.2)] p-2 relative animate-float-slow">
							<div className="w-full h-full border border-white/10 rounded-2xl bg-gradient-to-b from-[#12121e] to-[#050508] flex flex-col items-center justify-between py-12 px-6">
								<span className="text-[10px] font-bold tracking-[0.6em] text-purple-400 uppercase">{selectedCard.type}</span>
								<div className="flex flex-col items-center">
									<span className="text-9xl mb-10 text-purple-50 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] font-serif">{selectedCard.symbol}</span>
									<h3 className="text-3xl font-serif tracking-[0.2em] text-white uppercase">{selectedCard.name}</h3>
								</div>
								<div className="flex gap-3 opacity-30 text-purple-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
							</div>
						</div>
					</div>

					<div className="flex-1 space-y-10">
						<div className="space-y-4">
							<div className="flex items-center gap-4 text-white/20">
								<div className="w-12 h-px bg-white/10" />
								<span className="text-[10px] uppercase tracking-[0.5em] font-medium">Your Inquiry</span>
							</div>
							<p className="text-2xl text-white/80 font-light italic leading-relaxed">"{question}"</p>
						</div>

						<div className="space-y-6">
							<div className="flex items-center gap-4 text-purple-400/40">
								<div className="w-12 h-px bg-purple-500/20" />
								<span className="text-[10px] uppercase tracking-[0.5em] font-bold">The Oracle's Whispers</span>
							</div>
							<h4 className="text-4xl font-serif text-white/90 leading-tight">
								{selectedCard.message}
							</h4>
							<p className="text-white/40 text-lg leading-relaxed font-light">
								{question.includes('잘') || question.includes('어떻게') ? 
									`${selectedCard.name}의 기운은 당신의 물음에 '${selectedCard.keywords[0]}'와(과) '${selectedCard.keywords[1]}'을(를) 강조합니다. ${selectedCard.desc}` :
									`당신이 직면한 상황에서 ${selectedCard.name} 카드는 '${selectedCard.keywords.join(', ')}'의 메시지를 전합니다. ${selectedCard.desc}`
								}
							</p>
						</div>

						<div className="flex gap-4 pt-8">
							<button onClick={() => { setStep('input'); setQuestion(''); setSelectedCard(null); }} className="px-10 py-5 rounded-full border border-white/10 bg-white/5 text-[11px] tracking-[0.4em] uppercase text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center gap-3 font-medium">
								<RefreshCw size={14} /> 다시 물어보기
							</button>
							<button onClick={() => setView('home')} className="px-10 py-5 rounded-full bg-purple-600 text-[11px] tracking-[0.4em] uppercase text-white hover:bg-purple-500 transition-all font-medium shadow-lg shadow-purple-900/30">
								메인으로 돌아가기
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const App = () => {
	const [view, setView] = useState('splash');
	const [showSplash, setShowSplash] = useState(true);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [todayCard, setTodayCard] = useState(null);
	const splashContainer = useRef(null);

	useEffect(() => {
		setTodayCard(TARO_CARDS[Math.floor(Math.random() * TARO_CARDS.length)]);
	}, []);

	useEffect(() => {
		if (view !== 'splash' || !splashContainer.current) return;
		
		while (splashContainer.current.firstChild) {
			splashContainer.current.removeChild(splashContainer.current.firstChild);
		}

		let scene, camera, renderer, cardMesh, animationId;
		const startTime = Date.now();
		const duration = 2.5;
		
		const initThree = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(width, height);
			splashContainer.current.appendChild(renderer.domElement);

			const createSplashTexture = () => {
				const canvas = document.createElement('canvas');
				canvas.width = 1024; canvas.height = 1536;
				const ctx = canvas.getContext('2d');
				ctx.fillStyle = '#0a0a12';
				ctx.fillRect(0, 0, 1024, 1536);
				ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
				ctx.lineWidth = 10;
				ctx.strokeRect(60, 60, 904, 1416);
				const grad = ctx.createRadialGradient(512, 768, 0, 512, 768, 600);
				grad.addColorStop(0, '#1a1a3a');
				grad.addColorStop(1, 'transparent');
				ctx.fillStyle = grad;
				ctx.beginPath(); ctx.arc(512, 768, 600, 0, Math.PI * 2); ctx.fill();
				ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
				ctx.font = '300px serif';
				ctx.textAlign = 'center';
				ctx.fillText('✧', 512, 880);
				return new THREE.CanvasTexture(canvas);
			};

			const texture = createSplashTexture();
			const geometry = new THREE.BoxGeometry(3.2, 4.8, 0.08);
			const materials = Array(4).fill(new THREE.MeshStandardMaterial({ color: 0x050505 }));
			materials.push(new THREE.MeshStandardMaterial({ map: texture }));
			materials.push(new THREE.MeshStandardMaterial({ map: texture }));
			
			cardMesh = new THREE.Mesh(geometry, materials);
			scene.add(cardMesh);
			
			const light = new THREE.PointLight(0xffffff, 5, 100);
			light.position.set(5, 5, 10);
			scene.add(light);
			scene.add(new THREE.AmbientLight(0xffffff, 0.7));
			camera.position.z = 9;
		};

		const animate = () => {
			const elapsed = (Date.now() - startTime) / 1000;
			const t = Math.min(elapsed / duration, 1);
			const easeOut = 1 - Math.pow(1 - t, 3);
			if (cardMesh) {
				cardMesh.position.x = easeOut * -6.5;
				cardMesh.rotation.y = easeOut * (Math.PI * 2.5);
				cardMesh.rotation.z = (1 - easeOut) * 0.15;
			}
			renderer.render(scene, camera);
			animationId = requestAnimationFrame(animate);
		};

		initThree();
		animate();
		
		const transitionTimer = setTimeout(() => setIsTransitioning(true), 2500);
		const viewTimer = setTimeout(() => {
			setView('home');
			setTimeout(() => {
				setShowSplash(false);
			}, 1000);
		}, 3300);
		
		return () => {
			clearTimeout(transitionTimer); 
			clearTimeout(viewTimer);
			cancelAnimationFrame(animationId);
			if (renderer) {
				renderer.dispose();
				if (renderer.domElement && renderer.domElement.parentNode) {
					renderer.domElement.parentNode.removeChild(renderer.domElement);
				}
			}
		};
	}, [view]);

	return (
		<div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/40 tab-size-4 scroll-smooth">
			<div className="fixed inset-0 pointer-events-none z-0">
				<div className="absolute top-[-15%] left-[-5%] w-[70%] h-[70%] bg-purple-900/10 rounded-full blur-[180px] animate-pulse-slow"></div>
				<div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[160px] animate-pulse-slow delay-1000"></div>
				<div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', backgroundSize: '80px 80px' }}></div>
			</div>

			{showSplash && (
				<SplashView isTransitioning={isTransitioning} splashContainer={splashContainer} />
			)}
			
			{!showSplash || isTransitioning ? (
				<div className="relative z-10">
					<Navigation setView={setView} />
					{view === 'home' && <HomeView todayCard={todayCard} setView={setView} />}
					{view === 'reading' && <ReadingView setView={setView} />}
					
					<footer className="py-24 bg-[#020202] text-center relative z-20 border-t border-white/5">
						<div className="flex justify-center gap-10 mb-8 opacity-20">
							<Star size={14} /><Moon size={14} /><Sun size={14} />
						</div>
						<p className="text-[10px] tracking-[0.7em] text-white/10 uppercase font-light">
							&copy; 2026 ARCANA ORACLE &bull; DIVINE WISDOM FROM THE COSMOS
						</p>
					</footer>
				</div>
			) : null}

			<style>{`
				.rotate-y-180 { transform: rotateY(180deg); }
				.backface-hidden { backface-visibility: hidden; }
				.transform-style-3d { transform-style: preserve-3d; }
				.text-glow { text-shadow: 0 0 20px rgba(216, 180, 254, 0.4); }
				.perspective-1000 { perspective: 1000px; }
				.scrollbar-none::-webkit-scrollbar { display: none; }

				@keyframes infinite-scroll {
					from { transform: translateX(0); }
					to { transform: translateX(-33.33%); }
				}
				.animate-infinite-scroll {
					animation: infinite-scroll 10s linear infinite;
				}

				.wave {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 200%;
					height: 100%;
					background-repeat: repeat-x;
					background-position: 0 bottom;
					transform-origin: center bottom;
				}
				.wave-primary {
					background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" fill="%231a1033" /></svg>');
					background-size: 50% 120px;
					animation: wave-move 20s linear infinite;
					z-index: 10;
					opacity: 0.8;
				}
				.wave-secondary {
					background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" fill="%234c1d95" /></svg>');
					background-size: 50% 100px;
					animation: wave-move 12s linear infinite reverse;
					z-index: 5;
					opacity: 0.4;
					bottom: 10px;
				}

				@keyframes wave-move {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}

				.galaxy-gradient {
					background: radial-gradient(circle at 20% 30%, #1a1033 0%, transparent 40%),
					            radial-gradient(circle at 80% 70%, #0c0c24 0%, transparent 40%),
					            radial-gradient(circle at 50% 50%, #2e1065 0%, transparent 60%);
					filter: blur(60px);
					animation: galaxy-flow 25s ease-in-out infinite alternate;
				}
				@keyframes galaxy-flow {
					0% { transform: scale(1) translate(0, 0) rotate(0deg); }
					50% { transform: scale(1.2) translate(5%, 2%) rotate(2deg); }
					100% { transform: scale(1) translate(-2%, 5%) rotate(-1deg); }
				}

				@keyframes float { 
					0%, 100% { transform: translateY(0) rotate(0); } 
					50% { transform: translateY(-20px) rotate(1.5deg); } 
				}
				.animate-float { animation: float 12s ease-in-out infinite; }

				@keyframes float-slow {
					0%, 100% { transform: translateY(0) rotate(-1deg); }
					50% { transform: translateY(-15px) rotate(1deg); }
				}
				.animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
				
				@keyframes pulse-slow { 
					0%, 100% { opacity: 0.1; transform: scale(1); } 
					50% { opacity: 0.25; transform: scale(1.15); } 
				}
				.animate-pulse-slow { animation: pulse-slow 20s ease-in-out infinite; }
				
				.animate-in { animation: animate-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
				@keyframes animate-in { 
					from { opacity: 0; transform: translateY(40px); filter: blur(15px); } 
					to { opacity: 1; transform: translateY(0); filter: blur(0); } 
				}
			`}</style>
		</div>
	);
};

export default App;
