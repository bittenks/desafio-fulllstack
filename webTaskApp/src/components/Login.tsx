import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { loginUser } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("username", username);

      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso.",
      });

      navigate("/tarefas");

    } catch (error) {

      toast({
        title: "Erro",
        description: "Erro ao fazer login. Verifique suas credenciais.",
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form onSubmit={handleLogin} className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Insira seu nome de usuário e senha para acessar sua conta
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
              Entrar
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <a href="/cadastro" className="underline">
              Cadastre-se
            </a>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://obuc.com.br/wp-content/uploads/2024/07/carrossel-imgscarrossel03-img04.jpg"
          alt="Imagem"
          width="1920"
          height="1080"
          className="h-full w-full object-cover object-right dark:brightness-[0.7] dark:grayscale"
        />
      </div>
    </div>
  )
}
