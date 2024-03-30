const ProgressBar = ({ timeLeft, duration }) => {
  const calculateProgress = () => {
    if (duration) {
      return ((timeLeft / duration) * 100).toFixed(2);
    }
    return 0;
  };

  const getProgressBarColor = () => {
    if (duration) {
      const timePercentage = (timeLeft / duration) * 100;

      if (timePercentage > 75) {
        return 'bg-green-500';
      } else if (timePercentage > 25) {
        return 'bg-yellow-500';
      } else {
        return 'bg-red-500';
      }
    }
    return 'bg-gray-500';
  };

  return (
    <div className='grid grid-cols-12 items-center gap-4'>
      <div className='col-span-10 relative w-full bg-gray-200 rounded-lg h-2'>
        <div
          className={`absolute top-0 left-0 rounded-lg h-2 transition-all duration-500 ease-linear ${getProgressBarColor()}`}
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
      <div className='col-span-2'>
        <p className='text-lg'> {timeLeft}s</p>
      </div>
    </div>
  );
};

export default ProgressBar;
