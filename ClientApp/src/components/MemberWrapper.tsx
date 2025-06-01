import { ReactNode } from 'react';
import Header from './Header';
import Restricted from './Restricted';

type MemberWrapperProps = {
  children: ReactNode;
};

export default function MemberWrapper({ children }: MemberWrapperProps) {
  return (
    <Restricted>
      <Header />
      <main>
        {children}
      </main>
    </Restricted>
  );
}