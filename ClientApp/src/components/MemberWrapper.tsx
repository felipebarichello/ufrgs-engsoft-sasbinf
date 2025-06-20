import { ReactNode } from 'react';
import Header from './Header';
import Restricted from './MemberRestricted';

type MemberWrapperProps = {
  children: ReactNode;
};

export default function MemberWrapper({ children }: MemberWrapperProps) {
  return (
    <Restricted>
      <Header />
      <main>
        <div className="standard-page-container">
          {children}
        </div>
      </main>
    </Restricted>
  );
}