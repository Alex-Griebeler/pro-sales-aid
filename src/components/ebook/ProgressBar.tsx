interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
}

const ProgressBar = ({ currentPage, totalPages }: ProgressBarProps) => {
  const progress = ((currentPage + 1) / totalPages) * 100;
  
  return (
    <div className="w-full h-1 bg-surface">
      <div 
        className="h-full bg-accent transition-all duration-700 ease-in-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
