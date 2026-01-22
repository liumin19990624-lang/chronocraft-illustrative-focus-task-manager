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
import { Priority, TaskType } from '@shared/types';
const taskSchema = z.object({
  title: z.string().min(2, '标题太短了'),
  priority: z.coerce.number().min(1).max(4),
  type: z.enum(['reading', 'listening', 'writing', 'other']),
  dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '��间格式错误 (HH:mm)'),
  pomodoroEstimate: z.coerce.number().int().min(1, '至少需要1个番茄'),
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
      type: 'other',
      dueTime: '09:00',
      pomodoroEstimate: 1,
    },
  });
  const onSubmit = async (data: TaskFormData) => {
    const taskData = {
      ...data,
      dueDate: new Date().toISOString(),
      tags: [],
    };
    try {
      await addTask(taskData);
      toast.success(`任务 "${data.title}" 已成功添加到卡组`);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error("添加任务失败");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">构思新蓝图</DialogTitle>
          <DialogDescription className="text-base">
            规划你的下���个创造性任务，设置优先级与预估时长。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold">任务标题</Label>
            <Input id="title" {...register('title')} placeholder="例如：深度阅读《时间简史》" className="rounded-xl" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold">类型</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">论文/书籍阅读</SelectItem>
                      <SelectItem value="listening">���力/播客练习</SelectItem>
                      <SelectItem value="writing">内容/代码创作</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold">优先级</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">P1 - 紧急</SelectItem>
                      <SelectItem value="2">P2 - 重要</SelectItem>
                      <SelectItem value="3">P3 - 普通</SelectItem>
                      <SelectItem value="4">P4 - ��意</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueTime" className="text-sm font-bold">执行时间</Label>
              <Input id="dueTime" {...register('dueTime')} placeholder="09:00" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pomodoroEstimate" className="text-sm font-bold">番茄钟预估</Label>
              <Input id="pomodoroEstimate" type="number" {...register('pomodoroEstimate')} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full rounded-2xl h-12 text-lg font-bold">发布任务</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}