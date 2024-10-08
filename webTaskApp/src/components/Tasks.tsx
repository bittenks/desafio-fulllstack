import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUsers,
} from "@/services/api";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/hooks/useAuth";
import { EditIcon, PlusSquareIcon, TrashIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useNavigate } from "react-router-dom";

export interface Task {
  title: string;
  id: number;
  descricao: string;
  responsavel: {
    id: number; // ID do responsável
    username: string; // Nome do responsável
  };
  usuario: {
    id: number; // ID do responsável
    username: string; // Nome do responsável
  };
  status: string;
}


export default function Tasks() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskCriador, setTaskCriador] = useState<string>("");

  const [taskName, setTaskName] = useState<string>("");
  const [taskDescr, setTaskDescr] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<string>("");

  const [responsibleId, setResponsibleId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {

      try {
        if (token) {
          const usersData = await getUsers();
          setUsers(usersData || []);
        }
      }
      catch (error) {
        console.error("Erro ao buscar usuários:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários.",
        });
      }
    };

    const fetchTasks = async () => {
      try {
        if (token) {
          setLoading(true);
          const tasksData = await getTasks(token);
          if (tasksData) {
            setTasks(tasksData || []);
          }
        }
      } catch (error) {
        setError("Erro ao buscar tarefas.");
        toast({
          title: "Erro",
          description: "Erro ao carregar tarefas.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers()
    fetchTasks();
  }, [token, toast]);
  if (!token) {
    navigate('/login'); // Redireciona para a página de login
  }
  const filteredTasks = tasks.filter((task) =>
    filterStatus === "Todos" ? true : task.status === filterStatus
  );

  const handleOpenDialog = (task: Task | null = null) => {
    setTaskToEdit(task);
    if (task) {
      setTaskStatus(task.status) // status antes de atualizar
      setTaskName(task.title);
      setTaskCriador(task.usuario.username)
      setResponsibleId(task.responsavel.id.toString()); // Supondo que seja um ID
      setStatus(task.status);
      setTaskDescr(task.descricao)
    } else {
      setTaskName("");
      setTaskCriador("");
      setTaskStatus("")
      setTaskDescr("")
      setResponsibleId("");
      setTaskStatus('')
      setStatus("Não Iniciada");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async () => {
    try {
      if (!taskName || !taskDescr || !responsibleId || !status) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos.",
          variant: 'destructive'
        });
        return;
      }

      if (token) {
        if (taskToEdit) {
          // Atualiza a tarefa existente
          await updateTask(taskToEdit.id, { title: taskName, descricao: taskDescr, responsavel: responsibleId, status }, token);
          toast({
            title: "Sucesso",
            description: "Tarefa editada com sucesso.",
          });
        } else {
          // Cria uma nova tarefa
          await createTask({ title: taskName, descricao: taskDescr, responsavel: responsibleId, status }, token);
          toast({
            title: "Sucesso",
            description: "Tarefa criada com sucesso.",
          });
        }

        // Atualiza a lista de tarefas após a criação ou edição
        const tasksData = await getTasks(token);
        setTasks(tasksData ?? []);
      }

      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar a tarefa.",
      });
    }
  };


  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        if (token) {
          await deleteTask(taskToDelete.id, token);
          setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
          toast({
            title: "Sucesso",
            description: "Tarefa excluída com sucesso.",
          });
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir a tarefa. Somente quem criou pode excluir",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    }
  };

  if (loading) {
    return <p>Carregando tarefas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="flex justify-between my-4 mx-5">
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Não Iniciada">Não Iniciada</SelectItem>
            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
            <SelectItem value="Concluída">Concluída</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => handleOpenDialog()}
          className="mb-4"
          variant={'default'}
        >
          <PlusSquareIcon className="w-4 mr-2" /> Criar Nova Tarefa
        </Button>
      </div>
      <div className="flex min-h-screen bg-background-100">
        <div className="w-full mb-4 px-4 max-w-full mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Suas Tarefas</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Visualize o histórico de todas as suas tarefas.
            </p>
          </div>
          <div className="space-y-4 mb-4 bg-background-80 shadow-lg rounded-lg p-6 border">
            <div className="overflow-y-auto text-sm max-h-[55rem] overflow-x-hidden">
              <Table className="border-collapse w-full">
                <TableHeader className="font-bold text-center bg-headerTable">
                  <TableRow>
                    <TableHead className="font-semibold text-center">Tarefa</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="font-semibold text-center">Descrição</TableHead>
                    <TableHead className="font-semibold text-center">Responsável</TableHead>
                    <TableHead className="font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task: Task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <TableCell className="font-semibold text-center">{task.title}</TableCell>
                      <TableCell className="font-semibold text-center">
                        <Badge className={getBadgeVariant(task.status)}>

                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-center">{task.descricao}</TableCell>

                      <TableCell className="font-semibold text-center">{task.responsavel.username}</TableCell> {/* Alterado aqui */}
                      <TableCell className="font-semibold text-center flex justify-center gap-4">
                        <Button
                          onClick={() => handleOpenDialog(task)}
                          variant="outline"
                          className="text-primary hover:bg-primary/10"

                        >
                          <EditIcon className="w-4 h-4 mr-1" /> Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteTask(task)}
                          variant="ghost"
                          className="text-red-500 hover:bg-red-100"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" /> Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{taskToEdit ? "Editar Tarefa" : "Criar Nova Tarefa"}</DialogTitle>
                    <p className="font-thin italic">{taskToEdit ? `Criado por: ${taskCriador}` : ""}</p>

                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="taskName">Nome da Tarefa</Label>
                      <Input
                        id="taskName"
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        disabled={taskStatus === 'Concluída'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskDescr">Descrição da Tarefa</Label>
                      <Textarea
                        id="taskDescr"
                        value={taskDescr}
                        onChange={(e) => setTaskDescr(e.target.value)}
                        required
                        disabled={taskStatus === 'Concluída'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="responsibleId">Responsável</Label>
                      <Select value={responsibleId} onValueChange={setResponsibleId} required>
                        <SelectTrigger className="border rounded p-2 w-full" disabled={taskStatus === 'Concluída'}>
                          <SelectValue placeholder="Selecione um responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id.toString()}>{user.username}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(value) => setStatus(value)} required>
                        <SelectTrigger className="border rounded p-2 w-full" disabled={taskStatus === 'Concluída'}>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Não Iniciada">Não Iniciada</SelectItem>
                          <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                          <SelectItem value="Concluída">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleCloseDialog} variant="outline" className="border-primary text-primary">
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveTask}
                      className="bg-secondary text-secondary-foreground"
                      disabled={taskStatus === 'Concluída'}
                    >
                      {taskToEdit ? "Salvar" : "Criar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>


              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Excluir Tarefa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Tem certeza que deseja excluir esta tarefa?</p>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={() => setIsDeleteDialogOpen(false)} variant="outline" className="border-primary text-primary">
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={confirmDeleteTask}
                      className="bg-red-500 text-white"
                    >
                      Excluir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getBadgeVariant(status: string) {
  switch (status) {
    case "Não Iniciada":
      return "outline bg-yellow-500 text-white";
    case "Em Andamento":
      return "outline bg-[#084c6c] text-white";
    case "Concluída":
      return "outline bg-green-500 text-white";
    default:
      return "outline bg-gray-500 text-white";
  }
}
