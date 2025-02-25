import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
  size?: `medium` | `large`
}
const SubHeading = ({ title, description = '', size = 'medium', className }: HeadingProps) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <motion.span
      // initial={{ x: -20 }}
      // animate={{ x: 0, transition: { delay: 0.2 } }}
      >
        <Typography className={`font-semibold border-l-2 !border-secondary-main pl-8 text-text-secondary ${size == 'medium' ? 'text-lg' : 'text-xl'}`}>
          {title}
        </Typography>
      </motion.span>
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      >
        <Typography
          component={motion.span}
          className="text-sm font-medium"
          color="text.secondary"
        >
          {description}
        </Typography>
      </motion.span>
    </div>
  );
};

export default SubHeading;