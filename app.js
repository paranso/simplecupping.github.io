const SimpleCuppingForm = () => {
   // 현재 선택된 커핑 노트 ID
   const [currentNoteId, setCurrentNoteId] = React.useState(() => {
       return localStorage.getItem('currentNoteId') || Date.now().toString();
   });

   // 저장된 커핑 노트 목록
   const [savedNotes, setSavedNotes] = React.useState(() => {
       const saved = localStorage.getItem('savedNotesList');
       return saved ? JSON.parse(saved) : [];
   });

   // 마지막 저장 시간
   const [lastSaved, setLastSaved] = React.useState(null);

   // 알림 상태
   const [notification, setNotification] = React.useState({ show: false, message: '', type: '' });

   const [scores, setScores] = React.useState(() => {
       const savedScores = localStorage.getItem(`scores_${currentNoteId}`);
       return savedScores ? JSON.parse(savedScores) : {
           aroma: 3,
           acidity: 3,
           sweetness: 3,
           body: 3,
           aftertaste: 3
       };
   });

   const aromaWheel = {
       '꽃': ['장미', '자스민', '라일락', '커피블라썸', '오렌지꽃'],
       '과일류': ['감귤류(오렌지/레몬)', '베리류', '열대과일', '사과/배', '자두/체리'],
       '허브': ['민트', '캐모마일', '라벤더', '로즈마리', '타임'],
       '견과류': ['아몬드', '헤이즐넛', '피칸', '땅콩', '호두'],
       '캐러멜': ['흑설탕', '버터스카치', '메이플시럽', '토피', '캔디'],
       '초콜릿': ['다크초콜릿', '밀크초콜릿', '코코아', '초콜릿시럽', '모카']
   };

   const [selectedAromas, setSelectedAromas] = React.useState(() => {
       const saved = localStorage.getItem(`aromas_${currentNoteId}`);
       return saved ? JSON.parse(saved) : [];
   });

   const [expandedCategory, setExpandedCategory] = React.useState(null);
   
   const [notes, setNotes] = React.useState(() => {
       return localStorage.getItem(`notes_${currentNoteId}`) || '';
   });

   const [customNotes, setCustomNotes] = React.useState(() => {
       const saved = localStorage.getItem(`customNotes_${currentNoteId}`);
       return saved ? JSON.parse(saved) : {
           꽃: '',
           과일류: '',
           허브: '',
           견과류: '',
           캐러멜: '',
           초콜릿: ''
       };
   });

   const [roastingNotes, setRoastingNotes] = React.useState(() => {
       return localStorage.getItem(`roastingNotes_${currentNoteId}`) || '';
   });

   const [dates, setDates] = React.useState(() => {
       const saved = localStorage.getItem(`dates_${currentNoteId}`);
       return saved ? JSON.parse(saved) : {
           roastingDate: '',
           cuppingDate: new Date().toISOString().split('T')[0]
       };
   });

   // 알림 표시 함수
   const showNotification = (message, type = 'success') => {
       setNotification({ show: true, message, type });
       setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
   };

   // 현재 데이터 저장
   const saveCurrentNote = () => {
       try {
           const currentTime = new Date().toLocaleString();
           const noteData = {
               id: currentNoteId,
               timestamp: currentTime,
               title: `커핑 노트 ${new Date(dates.cuppingDate).toLocaleDateString()}`,
               dates,
               scores,
               selectedAromas,
               customNotes,
               notes,
               roastingNotes
           };

           // 현재 노트 저장
           localStorage.setItem(`note_${currentNoteId}`, JSON.stringify(noteData));

           // 저장된 노트 목록 업데이트
           const updatedNotes = savedNotes.filter(note => note.id !== currentNoteId);
           updatedNotes.push(noteData);
           localStorage.setItem('savedNotesList', JSON.stringify(updatedNotes));
           setSavedNotes(updatedNotes);

           setLastSaved(currentTime);
           showNotification('저장되었습니다.');
       } catch (error) {
           showNotification('저장 중 오류가 발생했습니다.', 'error');
       }
   };

   // 새 노트 시작
   const startNewNote = () => {
       const newId = Date.now().toString();
       setCurrentNoteId(newId);
       localStorage.setItem('currentNoteId', newId);
       
       // 모든 필드 초기화
       setScores({
           aroma: 3,
           acidity: 3,
           sweetness: 3,
           body: 3,
           aftertaste: 3
       });
       setSelectedAromas([]);
       setNotes('');
       setCustomNotes({
           꽃: '',
           과일류: '',
           허브: '',
           견과류: '',
           캐러멜: '',
           초콜릿: ''
       });
       setRoastingNotes('');
       setDates({
           roastingDate: '',
           cuppingDate: new Date().toISOString().split('T')[0]
       });
       
       showNotification('새로운 커핑 노트가 시작되었습니다.');
   };

   // 저장된 노트 불러오기
   const loadNote = (noteId) => {
       try {
           const noteData = JSON.parse(localStorage.getItem(`note_${noteId}`));
           if (noteData) {
               setCurrentNoteId(noteId);
               setDates(noteData.dates);
               setScores(noteData.scores);
               setSelectedAromas(noteData.selectedAromas);
               setCustomNotes(noteData.customNotes);
               setNotes(noteData.notes);
               setRoastingNotes(noteData.roastingNotes);
               showNotification('커핑 노트를 불러왔습니다.');
           }
       } catch (error) {
           showNotification('노트를 불러오는 중 오류가 발생했습니다.', 'error');
       }
   };

   // 노트 삭제
   const deleteNote = (noteId) => {
       if (window.confirm('이 커핑 노트를 삭제하시겠습니까?')) {
           try {
               localStorage.removeItem(`note_${noteId}`);
               const updatedNotes = savedNotes.filter(note => note.id !== noteId);
               localStorage.setItem('savedNotesList', JSON.stringify(updatedNotes));
               setSavedNotes(updatedNotes);
               
               if (currentNoteId === noteId) {
                   startNewNote();
               }
               
               showNotification('커핑 노트가 삭제되었습니다.');
           } catch (error) {
               showNotification('삭제 중 오류가 발생했습니다.', 'error');
           }
       }
   };

   // 나머지 기존 코드는 동일...

   return (
       <div className="container mx-auto px-4 py-8 max-w-2xl">
           {/* 알림 컴포넌트 */}
           {notification.show && (
               <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                   notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
               } text-white`}>
                   {notification.message}
               </div>
           )}

           {/* 저장된 노트 목록 */}
           <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
               <div className="flex justify-between items-center mb-4">
                   <h2 className="text-lg font-semibold">저장된 커핑 노트</h2>
                   <button
                       onClick={startNewNote}
                       className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                   >
                       새 노트
                   </button>
               </div>
               <div className="space-y-2">
                   {savedNotes.map(note => (
                       <div key={note.id} className="flex items-center justify-between p-2 border rounded">
                           <span>{note.title}</span>
                           <div className="space-x-2">
                               <button
                                   onClick={() => loadNote(note.id)}
                                   className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                               >
                                   불러오기
                               </button>
                               <button
                                   onClick={() => deleteNote(note.id)}
                                   className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                               >
                                   삭제
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           <div className="bg-white rounded-lg shadow-lg p-6">
               <div className="flex justify-between items-center mb-6">
                   <h1 className="text-2xl font-bold">커피 커핑 폼</h1>
                   <div className="space-x-4">
                       <button
                           onClick={saveCurrentNote}
                           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                       >
                           저장
                       </button>
                   </div>
               </div>
               
               {lastSaved && (
                   <div className="text-sm text-gray-500 mb-4">
                       마지막 저장: {lastSaved}
                   </div>
               )}

               {/* 기존의 나머지 폼 요소들... */}
           </div>
       </div>
   );
};

const rootElement = document.getElementById('root');
if (rootElement) {
   const root = ReactDOM.createRoot(rootElement);
   root.render(<SimpleCuppingForm />);
}
