const SimpleCuppingForm = () => {
    // 기존 상태 관리
    const [scores, setScores] = React.useState(() => {
        const saved = localStorage.getItem('cupping-scores');
        return saved ? JSON.parse(saved) : {
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

    // 상태 관리에 localStorage 적용
    const [selectedAromas, setSelectedAromas] = React.useState(() => {
        const saved = localStorage.getItem('cupping-selected-aromas');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [expandedCategory, setExpandedCategory] = React.useState(null);
    
    const [notes, setNotes] = React.useState(() => {
        const saved = localStorage.getItem('cupping-notes');
        return saved ? JSON.parse(saved) : '';
    });
    
    const [customNotes, setCustomNotes] = React.useState(() => {
        const saved = localStorage.getItem('cupping-custom-notes');
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
        const saved = localStorage.getItem('cupping-roasting-notes');
        return saved ? JSON.parse(saved) : '';
    });

    const [roastingDate, setRoastingDate] = React.useState(() => {
        const saved = localStorage.getItem('cupping-roasting-date');
        return saved ? JSON.parse(saved) : '';
    });

    const [cuppingDate, setCuppingDate] = React.useState(() => {
        const saved = localStorage.getItem('cupping-date');
        return saved ? JSON.parse(saved) : '';
    });

    // localStorage 자동 저장
    React.useEffect(() => {
        localStorage.setItem('cupping-scores', JSON.stringify(scores));
    }, [scores]);

    React.useEffect(() => {
        localStorage.setItem('cupping-selected-aromas', JSON.stringify(selectedAromas));
    }, [selectedAromas]);

    React.useEffect(() => {
        localStorage.setItem('cupping-notes', JSON.stringify(notes));
    }, [notes]);

    React.useEffect(() => {
        localStorage.setItem('cupping-custom-notes', JSON.stringify(customNotes));
    }, [customNotes]);

    React.useEffect(() => {
        localStorage.setItem('cupping-roasting-notes', JSON.stringify(roastingNotes));
    }, [roastingNotes]);

    React.useEffect(() => {
        localStorage.setItem('cupping-roasting-date', JSON.stringify(roastingDate));
    }, [roastingDate]);

    React.useEffect(() => {
        localStorage.setItem('cupping-date', JSON.stringify(cuppingDate));
    }, [cuppingDate]);

    // 기존 핸들러들
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

    // JSON 내보내기 함수
    const exportToJson = () => {
        const data = {
            roastingDate,
            cuppingDate,
            scores,
            selectedAromas,
            customNotes,
            notes,
            roastingNotes
        };
        const dataStr = JSON.stringify(data);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `cupping-note-${new Date().toISOString().slice(0,10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // JSON 불러오기 함수
    const importFromJson = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            setRoastingDate(data.roastingDate);
            setCuppingDate(data.cuppingDate);
            setScores(data.scores);
            setSelectedAromas(data.selectedAromas);
            setCustomNotes(data.customNotes);
            setNotes(data.notes);
            setRoastingNotes(data.roastingNotes);
        };
        reader.readAsText(file);
    };

    // PDF 저장 함수
    const savePDF = async () => {
        try {
            const element = document.getElementById('cupping-form');
            const canvas = await html2canvas(element, {
                scale: 2, // 더 나은 품질을 위해
                useCORS: true,
                logging: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            const imgProps = doc.getImageProperties(imgData);
            const imgWidth = pageWidth;
            const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
            
            doc.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
            doc.save(`cupping-note-${new Date().toISOString().slice(0,10)}.pdf`);
        } catch (error) {
            console.error('PDF 생성 중 오류:', error);
            alert('PDF 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* 저장 관련 버튼들 */}
            <div className="mb-4 flex gap-2 justify-end">
                <button 
                    onClick={exportToJson}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    JSON 내보내기
                </button>
                <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                    JSON 불러오기
                    <input
                        type="file"
                        accept=".json"
                        onChange={importFromJson}
                        className="hidden"
                    />
                </label>
                <button 
                    onClick={savePDF}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    PDF 저장
                </button>
            </div>

            <div id="cupping-form" className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center mb-6">커피 커핑 폼</h1>
                
                {/* 기본 정보 */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">로스팅 날짜</label>
                            <input 
                                type="date" 
                                value={roastingDate}
                                onChange={(e) => setRoastingDate(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">커핑 날짜</label>
                            <input 
                                type="date"
                                value={cuppingDate}
                                onChange={(e) => setCuppingDate(e.target.value)}
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
                            className="w-full h-32 p
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

// React 18 렌더링
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<SimpleCuppingForm />);
}
