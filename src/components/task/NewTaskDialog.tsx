import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
const taskSchema = z.object({
  title: z.string().min(3, '标题至少需要3个字符'),
  priority: z.coerce.number().min(1).max(4),
  pomodoroEstimate: z.coerce.number().int().min(1, '至少需要1个番茄钟'),
});
type TaskFormData = z.infer<typeof taskSchema>;
export function NewTaskDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const addTask = useAppStore(s => s.addTask);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      priority: 3,
      pomodoroEstimate: 1,
    },
  });
  const onSubmit = async (data: TaskFormData) => {
    const taskData = {
      ...data,
      dueDate: new Date().toISOString(), // Defaulting due date to now for simplicity
    };
    await addTask(taskData);
    toast.success(`任务 "${data.title}" 已添加!`);
    reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建任务蓝图</DialogTitle>
          <DialogDescription>
            ���划你的下一个杰作。填写下面的详细信息。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              标题
            </Label>
            <div className="col-span-3">
              <Input id="title" {...register('title')} placeholder="例如：完成项目报告" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              优先级
            </Label>
            <div className="col-span-3">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">P1 - 紧��</SelectItem>
                      <SelectItem value="2">P2 - 重要</SelectItem>
                      <SelectItem value="3">P3 - 普��</SelectItem>
                      <SelectItem value="4">P4 - 随意</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pomodoroEstimate" className="text-right">
              番茄钟
            </Label>
            <div className="col-span-3">
              <Input
                id="pomodoroEstimate"
                type="number"
                {...register('pomodoroEstimate')}
                placeholder="预估番茄钟数量"
                min="1"
              />
              {errors.pomodoroEstimate && <p className="text-red-500 text-xs mt-1">{errors.pomodoroEstimate.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">创建任务</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}