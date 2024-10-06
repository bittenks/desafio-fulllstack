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

export interface Task {
  id: number;
  descricao: string;
  responsavel: string;
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
  const [taskName, setTaskName] = useState<string>("");
  const [responsibleId, setResponsibleId] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Estado para armazenar o status selecionado no filtro
  const [filterStatus, setFilterStatus] = useState<string>("Todos");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (token) {
          setLoading(true);
          const tasksData = await getTasks(token);
          setTasks(tasksData || []);
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

    fetchTasks();
  }, [token, toast]);

  // Função para filtrar as tarefas com base no status selecionado
  const filteredTasks = tasks.filter((task) =>
    filterStatus === "Todos" ? true : task.status === filterStatus
  );

  const handleOpenDialog = (task: Task | null = null) => {
    setTaskToEdit(task);
    if (task) {
      setTaskName(task.descricao);
      setResponsibleId(task.responsavel);
      setStatus(task.status);
    } else {
      setTaskName("");
      setResponsibleId("");
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
      if (token) {
        if (taskToEdit) {
          await updateTask(taskToEdit.id, { descricao: taskName, responsavel: responsibleId, status }, token);
          toast({
            title: "Sucesso",
            description: "Tarefa editada com sucesso.",
          });
        } else {
          await createTask({ descricao: taskName, responsavel: responsibleId, status: status }, token);
          toast({
            title: "Sucesso",
            description: "Tarefa criada com sucesso.",
          });
        }
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
          description: "Erro ao excluir a tarefa.",
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
                    <TableHead className="font-semibold text-center">Responsável</TableHead>
                    <TableHead className="font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task: Task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <TableCell className="font-semibold text-center">{task.descricao}</TableCell>
                      <TableCell className="font-semibold text-center">
                        <Badge className={getBadgeVariant(task.status)}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-center">{task.responsavel}</TableCell>
                      <TableCell className="font-semibold text-center flex justify-center gap-4">
                        <Button
                          onClick={() => handleOpenDialog(task)}
                          variant="ghost"
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
              {/* Diálogo para criar/editar tarefas */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{taskToEdit ? "Editar Tarefa" : "Criar Nova Tarefa"}</DialogTitle>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="responsibleId">Responsável</Label>
                      <Input
                        id="responsibleId"
                        type="text"
                        value={responsibleId}
                        onChange={(e) => setResponsibleId(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(value) => setStatus(value)} required>
                        <SelectTrigger className="border rounded p-2 w-full">
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
                    >
                      {taskToEdit ? "Salvar" : "Criar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Diálogo para confirmação de exclusão */}
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
