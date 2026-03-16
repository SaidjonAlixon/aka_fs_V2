import DriverHero from './drivers/DriverHero';
import WhyDrive from './drivers/WhyDrive';
import DriverPositions from './drivers/DriverPositions';
import DriverRequirements from './drivers/DriverRequirements';
import DriverLife from './drivers/DriverLife';
import JoinProcess from './drivers/JoinProcess';

interface CareersProps {
  className?: string;
  onApplyClick?: () => void;
}

const Careers = ({ className = '', onApplyClick }: CareersProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <DriverHero onApplyClick={onApplyClick} />
      <WhyDrive />
      <DriverPositions onApplyClick={onApplyClick} />
      <DriverRequirements />
      <DriverLife />
      <JoinProcess onApplyClick={onApplyClick} />
    </div>
  );
};

export default Careers;
