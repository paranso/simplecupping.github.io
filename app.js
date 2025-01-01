

Start new chat
Projects
Starred
Star projects and chats you use often
Recents
(New chat)
(New chat)
Simple Coffee Cupping Guide for Beginners
Lower Back and Sacral Pain Relief
Identifying Coffee Contaminants Through "Clean Cup" Cupping
Determining the Most Appropriate Title
English Sentence Structure Visualizer
Referring to Employees in English
View all
Professional plan

LS
cw0303@gmail.com
Help & support
LS


Untitled


What can I help you with today?

이 코드에 localStorage 기능을 추가해줘. 
전체 코드를 알려줘.

선택된 파일 없음


3.5 Sonnet

Concise
Use shift + return for new line
Message limit reached for Claude 3.5 Sonnet until 1 AM.
You may still be able to continue on Claude 3.5 Haiku
Start Claude 3.5 Haiku chat


const SimpleCuppingForm = () => { const [scores, setScores] = React.useState({ aroma: 3, acidity: 3, sweetness: 3, body: 3, aftertaste: 3 }); cons
pasted
Chat controls

3.5 Sonnet
Most intelligent model Learn more

Content
No content added yet
Add images, PDFs, docs, spreadsheets, and more to summarize, analyze, and query content with Claude.
Chat styles
Font

Default

Pasted content

9.18 KB •220 lines
•
Formatting may be inconsistent from source

const SimpleCuppingForm = () => {
   const [scores, setScores] = React.useState({
       aroma: 3,
       acidity: 3,
       sweetness: 3,
       body: 3,
       aftertaste: 3
   });

   const aromaWheel = {
       '꽃': ['장미', '자스민', '라일락', '커피블라썸', '오렌지꽃'],
       '과일류': ['감귤류(오렌지/레몬)', '베리류', '열대과일', '사과/배', '자두/체리'],
       '허브': ['민트', '캐모마일', '라벤더', '로즈마리', '타임'],
       '견과류': ['아몬드', '헤이즐넛', '피칸', '땅콩', '호두'],
       '캐러멜': ['흑설탕', '버터스카치', '메이플시럽', '토피', '캔디'],
       '초콜릿': ['다크초콜릿', '밀크초콜릿', '코코아', '초콜릿시럽', '모카']
   };

   const [selectedAromas, setSelectedAromas] = React.useState([]);
   const [expandedCategory, setExpandedCategory] = React.useState(null);
   const [notes, setNotes] = React.useState('');
   const [customNotes, setCustomNotes] = React.useState({
       꽃: '',
       과일류: '',
       허브: '',
       견과류: '',
       캐러멜: '',
       초콜릿: ''
   });
   const [roastingNotes, setRoastingNotes] = React.useState('');

   const handleScoreChange = (category, value) => {
       setScores(prev => ({
           ...prev,
           [category]: parseInt(value)
       }));
   };

   const handleAromaSelect = (aroma) => {
       setSelectedAromas(prev => 
           prev.includes(aroma)
               ? prev.filter(a => a !== aroma)
               : [...prev, aroma]
       );
   };

   const handleCategoryClick = (category) => {
       setExpandedCategory(expandedCategory === category ? null : category);
   };

   const getRecommendation = () => {
       let recommendations = [];
       
       if (scores.acidity > 3) {
           recommendations.push("참고: 산미가 강한 편입니다. 로스팅 온도를 약간 높이면 산미를 줄일 수 있습니다.");
       }
       if (scores.body < 3) {
           recommendations.push("참고: 바디감을 높이려면 디벨롭 시간을 조금 더 가져가보세요.");
       }
       if (scores.sweetness < 3) {
           recommendations.push("참고: 단맛을 높이려면 첫 크랙 후 시간을 좀 더 가져가보세요.");
       }

       return recommendations.join(' ');
   };

   const scoreLabels = {
       aroma: '향',
       acidity: '산미',
       sweetness: '단맛',
       body: '바디감',
       aftertaste: '후미'
   };

   return (
       <div className="container mx-auto px-4 py-8 max-w-2xl">
           <div className="bg-white rounded-lg shadow-lg p-6">
               <h1 className="text-2xl font-bold text-center mb-6">커피 커핑 폼</h1>
               
               {/* 기본 정보 */}
               <div className="mb-8">
                   <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
                   <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="block text-sm font-medium mb-1">로스팅 날짜</label>
                           <input 
                               type="date" 
                               className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">커핑 날짜</label>
                           <input 
                               type="date"
                               className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                   </div>
               </div>

               {/* 평가 항목 */}
               <div className="mb-8">
                   <h2 className="text-lg font-semibold mb-4">평가 항목</h2>
                   {Object.entries(scores).map(([category, value]) => (
                       <div key={category} className="mb-6">
                           <label className="block text-sm font-medium mb-2">
                               {scoreLabels[category]}
                               <span className="ml-2 text-gray-500">{value}</span>
                           </label>
                           <input
                               type="range"
                               min="1"
                               max="5"
                               value={value}
                               onChange={(e) => handleScoreChange(category, e.target.value)}
                               className="w-full mb-1"
                           />
                           <div className="flex justify-between text-xs text-gray-500">
                               <span>약함</span>
                               <span>강함</span>
                           </div>
                       </div>
                   ))}
               </div>

               {/* 아로마 휠 */}
               <div className="mb-8">
                   <h2 className="text-lg font-semibold mb-4">향미 특성</h2>
                   {Object.entries(aromaWheel).map(([category, aromas]) => (
                       <div key={category} className="mb-2 border rounded">
                           <button
                               onClick={() => handleCategoryClick(category)}
                               className="w-full text-left p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                           >
                               {category}
                           </button>
                           {expandedCategory === category && (
                               <div className="p-3 bg-gray-50">
                                   <div className="flex flex-wrap gap-2 mb-3">
                                       {aromas.map(aroma => (
                                           <button
                                               key={aroma}
                                               onClick={() => handleAromaSelect(aroma)}
                                               className={`px-3 py-1 rounded-full text-sm ${
                                                   selectedAromas.includes(aroma)
                                                       ? 'bg-blue-500 text-white'
                                                       : 'bg-white text-gray-700 border'
                                               } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                           >
                                               {aroma}
                                           </button>
                                       ))}
                                   </div>
                                   <textarea
                                       value={customNotes[category]}
                                       onChange={(e) => setCustomNotes(prev => ({
                                           ...prev,
                                           [category]: e.target.value
                                       }))}
                                       placeholder={`${category}에 대한 세부 평가를 기록하세요...`}
                                       className="w-full p-2 border rounded h-20 text-sm resize-none"
                                   />
                               </div>
                           )}
                       </div>
                   ))}
               </div>

               {/* 선택된 향미 표시 */}
               {selectedAromas.length > 0 && (
                   <div className="mb-8">
                       <h3 className="text-sm font-medium mb-2">선택된 향미:</h3>
                       <div className="flex flex-wrap gap-2">
                           {selectedAromas.map(aroma => (
                               <span key={aroma} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                   {aroma}
                               </span>
                           ))}
                       </div>
                   </div>
               )}

               {/* 메모 */}
               <div className="mb-8">
                   <h2 className="text-lg font-semibold mb-4">추가 메모</h2>
                   <div className="bg-white border rounded-lg p-4">
                       <textarea
                           value={notes}
                           onChange={(e) => setNotes(e.target.value)}
                           placeholder="추가적인 느낌이나 특징을 기록하세요..."
                           className="w-full h-32 p-0 border-0 focus:outline-none resize-none"
                       />
                   </div>
               </div>

               {/* 로스팅 추천 */}
               <div>
                   <h2 className="text-lg font-semibold mb-4">로스팅 추천 방향</h2>
                   <div className="bg-white border rounded-lg p-4 h-32">
                       <textarea
                           value={roastingNotes}
                           onChange={(e) => setRoastingNotes(e.target.value)}
                           placeholder="로스팅 추천 방향을 기록하세요..."
                           className="w-full h-[80%] p-0 border-0 focus:outline-none resize-none"
                       />
                       <div className="text-xs text-gray-500 mt-2">
                           {getRecommendation()}
                       </div>
                   </div>
               </div>
           </div>
       </div>
   );
};

const rootElement = document.getElementById('root');
if (rootElement) {
   const root = ReactDOM.createRoot(rootElement);
   root.render(<SimpleCuppingForm />);
}
