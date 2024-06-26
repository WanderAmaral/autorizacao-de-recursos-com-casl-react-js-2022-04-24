import React, { useContext, useRef, useState } from "react";
import { Can, GuardContext } from "../../guards/GuardContext";
import { fetchTasks, create, removeTask, updateToClosed } from "./services";
import {
  ActionContainer,
  Container,
  Divider,
  DoneButton,
  ListContainer,
  ListItem,
  NewButton,
  RemoveButton,
  Input,
  Page,
  Form,
  Title,
  Id,
} from "./styles";

type Task = {
  id: number;
  title: string;
  status: "open" | "closed";
};

export const Home = () => {
  const ability = useContext(GuardContext);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  function refresh() {
    fetchTasks().then((tasks) => setTasks(tasks));
  }

  React.useEffect(() => {
    refresh();
  }, []);

  const onRemove = async (id: number) => {
    const canotRemove = ability.cannot("delete", "Task");

    if (canotRemove) {
      alert("Ops, você não tem permissão para isso, contate um admin.");
      return;
    }

    await removeTask(id);

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const onDone = async (id: number) => {
    await updateToClosed(id);

    setTasks((prev) => {
      return prev.map((task) =>
        task.id === id ? { ...task, status: "closed" } : task
      );
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await create(newTaskTitle);

      setNewTaskTitle("");

      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page>
      <Container>
        <Title>Task Manager</Title>

        <Can I="create" a="Task">
          <Form onSubmit={onSubmit}>
            <Input
              type="text"
              name="title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
            <NewButton type="submit">Criar nova tarefa</NewButton>
          </Form>
        </Can>

        <Divider />

        <ListContainer>
          {tasks.map((task) => (
            <ListItem $open={task.status === "open"} key={task.id}>
              <Id>{task.id}</Id>
              <p>{task.title}</p>
              <ActionContainer>
                {task.status === "open" && (
                  <Can I="update" a="Task">
                    <DoneButton onClick={() => onDone(task.id)}>
                      Concluir
                    </DoneButton>
                  </Can>
                )}
                <RemoveButton onClick={() => onRemove(task.id)}>
                  Excluir
                </RemoveButton>
              </ActionContainer>
            </ListItem>
          ))}
        </ListContainer>
      </Container>
    </Page>
  );
};
