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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Priority } from '@shared/types';
const taskSchema = z.object({
  title: z.string().min(2, '标题太短了'),
  priority: z.number().min(1).max(4),
  type: z.enum(['reading', 'listening', 'writing', 'other'] as const),
  dueDate: z.date(),
  dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '��间格式错误 (HH:mm)'),
  pomodoroEstimate: z.number().int().min(1, '至少需要1个番茄'),
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
      dueDate: new Date(),
      dueTime: '09:00',
      pomodoroEstimate: 1,
    },
  });
  const onSubmit = async (data: TaskFormData) => {
    try {
      await addTask({
        ...data,
        priority: data.priority as Priority,
        dueDate: data.dueDate.toISOString(),
      });
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
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">构思新蓝图</DialogTitle>
          <DialogDescription className="text-base font-medium text-muted-foreground/80">
            规划你的下一个创造性任务，设置优先级与预���时长。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold ml-1 text-foreground/80">任务标题</Label>
            <Input id="title" {...register('title')} placeholder="例如：深度阅读《时间简史》" className="rounded-xl bg-secondary/50 border-none h-12 focus-visible:ring-primary/20" />
            {errors.title && <p className="text-destructive text-xs font-bold ml-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1 text-foreground/80">类型</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-xl bg-secondary/50 border-none h-12 focus:ring-primary/20">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="reading">论文/书籍阅读</SelectItem>
                      <SelectItem value="listening">听力/播客练习</SelectItem>
                      <SelectItem value="writing">内容/代码��作</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold ml-1 text-foreground/80">优先级</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                    <SelectTrigger className="rounded-xl bg-secondary/50 border-none h-12 focus:ring-primary/20">
                      <SelectValue placeholder="优先级" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="1">P1 - 紧急</SelectItem>
                      <SelectItem value="2">P2 - 重要</SelectItem>
                      <SelectItem value="3">P3 - 普通</SelectItem>
                      <SelectItem value="4">P4 - 随意</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold ml-1 text-foreground/80">截止日期</Label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl bg-secondary/50 border-none h-12 hover:bg-secondary",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>选择日期</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="rounded-2xl"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueTime" className="text-sm font-bold ml-1 text-foreground/80">执行时间</Label>
              <Input id="dueTime" {...register('dueTime')} placeholder="09:00" className="rounded-xl bg-secondary/50 border-none h-12" />
              {errors.dueTime && <p className="text-destructive text-xs font-bold ml-1">{errors.dueTime.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pomodoroEstimate" className="text-sm font-bold ml-1 text-foreground/80">番茄预估</Label>
              <Input id="pomodoroEstimate" type="number" {...register('pomodoroEstimate', { valueAsNumber: true })} className="rounded-xl bg-secondary/50 border-none h-12" />
              {errors.pomodoroEstimate && <p className="text-destructive text-xs font-bold ml-1">{errors.pomodoroEstimate.message}</p>}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">发布任务蓝图</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}