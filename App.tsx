import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { TaskList } from './components/TaskList';
import { LoadingState } from './components/LoadingState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { CameraView } from './components/CameraView';
import { TabBar } from './components/TabBar';
import { extractTasksFromImage } from './services/geminiService';
import { Task } from './types';
import { RefreshCcw, History } from 'lucide-react';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

  const handleImageUpload = useCallback(async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setIsLoading(true);
    setError(null);
    setTasks([]);

    try {
      const extractedTasks = await extractTasksFromImage(file);
      const tasksWithDefaults = extractedTasks.map(task => ({
        ...task,
        id: crypto.randomUUID(),
        completed: false,
      }));
      setTasks(tasksWithDefaults);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try a clearer image.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleTask = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);
  
  const handleUpdateTaskName = useCallback((taskId: string, newName: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, name: newName.trim() } : task
      )
    );
  }, []);

  const handleReset = useCallback(() => {
    setTasks([]);
    setImagePreview(null);
    setIsLoading(false);
    setError(null);
    setIsCameraOpen(false);
    setActiveTab('today');
  }, []);

  const handleOpenCamera = () => {
    setError(null);
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = (file: File) => {
    setIsCameraOpen(false);
    handleImageUpload(file);
  };

  const renderTodayView = () => (
    <>
      {error && <ErrorDisplay message={error} />}

      {!imagePreview && !isLoading && (
        <UploadArea onImageUpload={handleImageUpload} onOpenCamera={handleOpenCamera} />
      )}

      {imagePreview && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-600 mb-3 px-1">Your Notes</h2>
          <img src={imagePreview} alt="Handwritten notes preview" className="w-full rounded-2xl shadow-md border border-zinc-200" />
        </div>
      )}

      {isLoading && <LoadingState />}
      
      {!isLoading && tasks.some(t => !t.completed) && (
        <TaskList
          title="Your Tasks"
          tasks={tasks.filter(t => !t.completed)}
          onToggleTask={handleToggleTask}
          onUpdateTaskName={handleUpdateTaskName}
        />
      )}

      {!isLoading && imagePreview && !tasks.some(t => !t.completed) && !error && (
        <div className="text-center mt-8 text-zinc-500">
          <p>No actionable tasks found in the image.</p>
          <p className="text-sm mt-1">Completed tasks are in the History tab.</p>
          <button onClick={handleReset} className="mt-4 text-blue-500 font-semibold flex items-center justify-center gap-2 w-full">
            <RefreshCcw size={16} />
            Try another image
          </button>
        </div>
      )}
    </>
  );

  const renderHistoryView = () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-zinc-500">
          <History size={48} className="mb-4 text-zinc-400" />
          <h2 className="text-xl font-bold text-zinc-700">No Completed Tasks</h2>
          <p>Once you complete tasks from the "Today" list, they will appear here.</p>
        </div>
      );
    }

    return (
       <TaskList
        title="Completed"
        tasks={completedTasks}
        onToggleTask={handleToggleTask}
        onUpdateTaskName={handleUpdateTaskName}
      />
    );
  };

  const renderContent = () => {
    if (isCameraOpen) {
      return <CameraView onCapture={handleCapture} onClose={handleCloseCamera} />;
    }

    return (
      <div className="w-full max-w-sm mx-auto bg-zinc-50 min-h-screen flex flex-col shadow-lg">
        <Header 
          onReset={handleReset} 
          hasContent={imagePreview !== null}
          activeTab={activeTab}
        />
        <main className="flex-grow overflow-y-auto px-4 pb-8 pt-2">
          {activeTab === 'today' ? renderTodayView() : renderHistoryView()}
        </main>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  };
  

  return (
    <div className="bg-zinc-200 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;