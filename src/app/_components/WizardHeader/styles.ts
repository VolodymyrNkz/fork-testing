export const styles = {
  root: 'flex bg-secondary gap-md p-xxs rounded-md',
  step: `
    text-textPrimary 
    text-light font-[500] flex-1 flex items-center justify-center text-center 
    font-bold py-[5px] px-xs relative 
    first:rounded-l-sm last:rounded-r-sm
    
  `,
  arrowStep: `
    bg-primary text-white z-10 
    after:absolute after:-right-[10px] after:content-[""] after:w-[20px] after:h-[20px] 
    after:bg-primary after:transform after:rotate-45 after:rounded-tr-sm
  `,
  activeStep:
    'bg-primary last:after:content-none text-white after:absolute after:right-[-20px] after:w-[20px] after:h-full after:bg-primary after:transform ',
  separator: 'before:absolute before:w-[1px] before:h-[60%] before:bg-white before:-left-xs',
  inactiveStep: 'bg-secondary text-gray-700',
  icon: 'w-[16px] h-[16px]',
  label: 'relative flex items-center gap-sm z-10',
  arrowIcon: 'relative -right-sm',
};
