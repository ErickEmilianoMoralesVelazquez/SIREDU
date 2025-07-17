import { Loader2 } from 'lucide-react';

const Loader = ({
  size = 'md',
  color = 'emerald',
  text = '',
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'md':
        return 'h-6 w-6';
      case 'lg':
        return 'h-8 w-8';
      case 'xl':
        return 'h-12 w-12';
      default:
        return 'h-6 w-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return 'text-emerald-600';
      case 'blue':
        return 'text-blue-600';
      case 'gray':
        return 'text-gray-600';
      case 'white':
        return 'text-white';
      default:
        return 'text-emerald-600';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const LoaderContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2
        className={`animate-spin ${getSizeClasses()} ${getColorClasses()}`}
      />
      {text && (
        <p className={`${getTextSize()} ${getColorClasses()} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <LoaderContent />
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
};

// Specialized loader components
export const ButtonLoader = ({ size = 'sm', color = 'white' }) => (
  <Loader2 className={`animate-spin ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${color === 'white' ? 'text-white' : 'text-emerald-600'}`} />
);

export const PageLoader = ({ text = 'Cargando...' }) => (
  <Loader
    size="lg"
    color="emerald"
    text={text}
    fullScreen={true}
  />
);

export const SectionLoader = ({ text = 'Cargando...' }) => (
  <div className="flex items-center justify-center py-8">
    <Loader
      size="md"
      color="emerald"
      text={text}
    />
  </div>
);

export const OverlayLoader = ({ text = 'Procesando...' }) => (
  <Loader
    size="lg"
    color="emerald"
    text={text}
    overlay={true}
  />
);

export default Loader;
