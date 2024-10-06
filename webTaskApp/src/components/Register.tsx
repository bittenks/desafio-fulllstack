import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { registerUser } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await registerUser({ username, password });
      toast({
        title: "Sucesso",
        description: "Usuário registrado com sucesso.",
      });
      setUsername("");
      setPassword("");
      <Navigate to="/" />
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar. Tente novamente com um nome de usuário diferente.",
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form onSubmit={handleRegister} className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Registro</h1>
            <p className="text-balance text-muted-foreground">
              Insira seu nome de usuário e senha para criar uma conta
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome de usuário"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <a href="/login" className="underline">
              Faça login
            </a>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://obuc.com.br/wp-content/uploads/2024/07/carrossel-imgscarrossel03-img03.jpg"
          alt="Imagem"
          width="1920"
          height="1080"
          className="h-full w-full object-cover object-right dark:brightness-[0.5] dark:grayscale"
        />

      </div>
    </div>
  );
}
