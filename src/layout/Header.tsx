interface HeaderProps {
    title: string;
  }
  
  const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
      <header className="sticky top-0 z-10 bg-white shadow px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
    );
  };
  
  export default Header;