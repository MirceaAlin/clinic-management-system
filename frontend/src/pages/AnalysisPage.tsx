import React, { useState, useMemo } from "react";
import GlassCard from "../components/GlassCard";
import OptionTile from "../components/OptionTile";
import GlassModal from "../components/GlassModal";
import AnalysisChartCard from "../components/AnalysisChartCard";
import { mockAnalyses } from "../data/mock";
import "../styles/glass.css";
import { MoreVertical } from "lucide-react";

const AnalysisPage: React.FC = () => {
  const [sortMenuOpen,      setSortMenuOpen]      = useState(false);
  const [analyses,          setAnalyses]          = useState(mockAnalyses);
  const [showCreateModal,   setShowCreateModal]   = useState(false);
  const [showViewModal,     setShowViewModal]     = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showOptionsMenu,   setShowOptionsMenu]   = useState(false);
  const [deleteMode,        setDeleteMode]        = useState(false);
  const [selectedIds,       setSelectedIds]       = useState<number[]>([]);
  const [showFilteredModal, setShowFilteredModal] = useState(false);
  const [filterType,        setFilterType]        = useState<"date" | "type" | null>(null);
  const [selectedCategory,  setSelectedCategory]  = useState<string | null>(null);
  const [selectedChartTest, setSelectedChartTest] = useState("Glicemie");

  const [newAnalysis, setNewAnalysis] = useState({
    testName: "", result: "", unit: "", normalRange: "", testDate: "",
    patientName: "Mogage Razvan",
  });

  const toggleSortMenu  = () => setSortMenuOpen(!sortMenuOpen);
  const sortByDateAsc   = () => { setAnalyses([...analyses].sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())); setSortMenuOpen(false); };
  const sortByDateDesc  = () => { setAnalyses([...analyses].sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())); setSortMenuOpen(false); };

  const handleCreate = () => {
    if (!newAnalysis.testName || !newAnalysis.result) return;
    setAnalyses([...analyses, { id: Date.now(), ...newAnalysis }]);
    setShowCreateModal(false);
    setNewAnalysis({ testName: "", result: "", unit: "", normalRange: "", testDate: "", patientName: "Mogage Razvan" });
  };

  const toggleSelection = (id: number) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const handleDelete = () => {
    setAnalyses((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
    setDeleteMode(false);
  };

  const filteredByOption = useMemo(() => {
    if (!filterType) return analyses;
    if (filterType === "date") return [...analyses].sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
    if (filterType === "type") return [...analyses].sort((a, b) => a.testName.localeCompare(b.testName));
    return analyses;
  }, [analyses, filterType]);

  const categories = useMemo(() => Array.from(new Set(analyses.map((a) => a.testName))), [analyses]);

  const filteredByCategory = useMemo(
    () => analyses.filter((a) => a.testName === selectedCategory),
    [analyses, selectedCategory]
  );

  const chartData = useMemo(() =>
    analyses
      .filter((a) => a.testName === selectedChartTest)
      .map((a) => ({ date: a.testDate, value: parseFloat(a.result) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [analyses, selectedChartTest]
  );

  return (
    <div className="analyses-page">
      {/* Sidebar */}
      <div className="analyses-sidebar">
        <div className="options-row">
          <OptionTile label="Vizualizare analize pacient" onClick={() => setShowViewModal(true)} />
          <OptionTile label="Creează analiză"             onClick={() => setShowCreateModal(true)} />
        </div>

        <div className="patient-header">
          <img
            src="/images/mogagerazvan.jpeg"
            alt="Patient"
            className="patient-photo"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div>
            <p className="label">Nume pacient:</p>
            <h1 className="patient-name">Mogage Razvan</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="analyses-main-content">
        <div className="analyses-sections">

          {/* Analize recente */}
          <GlassCard title="Analize recente">
            <div className="card-toolbar">
              <button className="menu-btn" onClick={toggleSortMenu} aria-label="Sortare">
                <MoreVertical size={20} />
              </button>
              {sortMenuOpen && (
                <div className="sort-menu">
                  <p onClick={sortByDateAsc}>Afișează după dată crescător</p>
                  <p onClick={sortByDateDesc}>Afișează după dată descrescător</p>
                </div>
              )}
            </div>
            <table className="analysis-table">
              <thead>
                <tr><th>Test</th><th>Rezultat</th><th>Interval normal</th><th>Data</th></tr>
              </thead>
              <tbody>
                {analyses.slice(0, 3).map((a) => (
                  <tr key={a.id}>
                    <td>{a.testName}</td>
                    <td>{a.result} {a.unit}</td>
                    <td>{a.normalRange}</td>
                    <td>{a.testDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>

          {/* Analize pe categorii */}
          <GlassCard title="Analize pe categorii">
            {categories.length === 0 ? (
              <p className="placeholder">Nu există analize disponibile.</p>
            ) : (
              <div className="category-list">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="category-tile"
                    onClick={() => { setSelectedCategory(cat); setShowCategoryModal(true); }}
                    role="button"
                    tabIndex={0}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Evoluția analizelor */}
          <GlassCard title="Evoluția analizelor">
            <div className="chart-toolbar">
              <select
                className="glass-select"
                value={selectedChartTest}
                onChange={(e) => setSelectedChartTest(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <AnalysisChartCard data={chartData} />
          </GlassCard>

        </div>
      </div>

      {/* Modal: Creează analiză */}
      {showCreateModal && (
        <GlassModal title="Creează o analiză" onClose={() => setShowCreateModal(false)}>
          <form
            className="form-grid"
            onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
          >
            <input type="text"  placeholder="Nume test *"          value={newAnalysis.testName}    onChange={(e) => setNewAnalysis({ ...newAnalysis, testName: e.target.value })} />
            <input type="text"  placeholder="Rezultat *"           value={newAnalysis.result}      onChange={(e) => setNewAnalysis({ ...newAnalysis, result: e.target.value })} />
            <input type="text"  placeholder="Unitate (ex: mg/dL)"  value={newAnalysis.unit}        onChange={(e) => setNewAnalysis({ ...newAnalysis, unit: e.target.value })} />
            <input type="text"  placeholder="Interval normal"      value={newAnalysis.normalRange} onChange={(e) => setNewAnalysis({ ...newAnalysis, normalRange: e.target.value })} />
            <input type="date"                                      value={newAnalysis.testDate}    onChange={(e) => setNewAnalysis({ ...newAnalysis, testDate: e.target.value })} />
            <button type="submit" className="submit-btn">Adaugă analiză</button>
          </form>
        </GlassModal>
      )}

      {/* Modal: Vizualizare toate analizele */}
      {showViewModal && (
        <GlassModal
          title="Toate analizele"
          onClose={() => { setShowViewModal(false); setDeleteMode(false); setSelectedIds([]); }}
          menu={
            <button className="menu-btn" onClick={() => setShowOptionsMenu(!showOptionsMenu)} aria-label="Opțiuni">
              <MoreVertical size={20} />
            </button>
          }
        >
          {showOptionsMenu && (
            <div className="sort-menu" style={{ top: 45 }}>
              <p onClick={() => { setDeleteMode(true); setShowOptionsMenu(false); }}>Ștergere</p>
              <p onClick={() => { setShowFilteredModal(true); setShowOptionsMenu(false); }}>Vizualizare filtrată</p>
            </div>
          )}
          {deleteMode && (
            <div className="delete-toolbar">
              <button className="cancel-btn" onClick={() => { setDeleteMode(false); setSelectedIds([]); }}>Anulează</button>
              <button className="delete-btn" onClick={handleDelete}>Șterge ({selectedIds.length})</button>
            </div>
          )}
          <table className="analysis-table">
            <thead>
              <tr>
                {deleteMode && <th></th>}
                <th>Test</th><th>Rezultat</th><th>Interval normal</th><th>Data</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr key={a.id}>
                  {deleteMode && (
                    <td>
                      <div
                        className={`circle-select ${selectedIds.includes(a.id) ? "selected" : ""}`}
                        onClick={() => toggleSelection(a.id)}
                        role="checkbox"
                        aria-checked={selectedIds.includes(a.id)}
                        tabIndex={0}
                      />
                    </td>
                  )}
                  <td>{a.testName}</td>
                  <td>{a.result} {a.unit}</td>
                  <td>{a.normalRange}</td>
                  <td>{a.testDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassModal>
      )}

      {/* Modal: Vizualizare filtrată */}
      {showFilteredModal && (
        <GlassModal title="Vizualizare analize" onClose={() => { setShowFilteredModal(false); setFilterType(null); }}>
          {!filterType ? (
            <div className="filter-options">
              <button className="filter-btn" onClick={() => setFilterType("date")}>După dată</button>
              <button className="filter-btn" onClick={() => setFilterType("type")}>După tip</button>
            </div>
          ) : (
            <table className="analysis-table">
              <thead>
                <tr><th>Test</th><th>Rezultat</th><th>Interval</th><th>Data</th></tr>
              </thead>
              <tbody>
                {filteredByOption.map((a) => (
                  <tr key={a.id}>
                    <td>{a.testName}</td>
                    <td>{a.result} {a.unit}</td>
                    <td>{a.normalRange}</td>
                    <td>{a.testDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassModal>
      )}

      {/* Modal: Categoria */}
      {showCategoryModal && selectedCategory && (
        <GlassModal
          title={`Analize: ${selectedCategory}`}
          onClose={() => { setSelectedCategory(null); setShowCategoryModal(false); }}
        >
          {filteredByCategory.length === 0 ? (
            <p>Nu există analize pentru acest test.</p>
          ) : (
            <table className="analysis-table">
              <thead>
                <tr><th>Rezultat</th><th>Unitate</th><th>Interval normal</th><th>Data</th></tr>
              </thead>
              <tbody>
                {filteredByCategory.map((a) => (
                  <tr key={a.id}>
                    <td>{a.result}</td>
                    <td>{a.unit}</td>
                    <td>{a.normalRange}</td>
                    <td>{a.testDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassModal>
      )}
    </div>
  );
};

export default AnalysisPage;
