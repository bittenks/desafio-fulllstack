import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import avatar from '../../public/iconeperfil.webp';
import obucIcon from '../../public/logo_tech.png';

export default function NavBar() {
  const { username, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  console.log(username);

  const shouldHideNavBar = ["/", "/login", "/cadastro"].includes(window.location.pathname);

  if (shouldHideNavBar) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex h-16 w-full items-center justify-between bg-background px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <a href="#" className="flex items-center gap-2">
          <img
            src={obucIcon}
            alt="Logo da empresa"
            className="h-10 w-auto"
            style={{ maxHeight: "40px", maxWidth: "100%" }}
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Gerenciador de Tarefas</span>
            <span className="text-base font-semibold">/// Desafio FullStack</span>
          </div>
        </a>
      </div>

      {/* Botão de menu para dispositivos móveis */}
      <button
        className="md:hidden text-gray-600 hover:text-gray-900"
        onClick={toggleMenu}
      >
        {isMenuOpen ? "✖" : "☰"} {/* Ícone de menu hamburguer */}
      </button>

      <nav className={`fixed inset-0 bg-white bg-opacity-90 z-50 transition-transform transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between p-4">
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={toggleMenu}
          >
            {isMenuOpen ? "✖" : "☰"} {/* Ícone de menu hamburguer */}
          </button>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`rounded-full   ${!isMenuOpen ? "hidden" : "☰"}`}>
                  <img
                    src={avatar}
                    alt="Avatar"
                    width="40"
                    height="40"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "fill" }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Olá, {username || localStorage.getItem('username')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Para dispositivos maiores */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img
                    src={avatar}
                    alt="Avatar"
                    width="40"
                    height="40"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "fill" }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Olá, {username || localStorage.getItem('username')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
