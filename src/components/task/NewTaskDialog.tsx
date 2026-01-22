import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Priority } from '@shared/types';
const taskSchema = z.object({
  title: z.string().min(2, '���题至少包含2个字'),
  priority: z.number().min(1).max(4),
  type: z.enum(['reading', 'listening', 'writing', 'other'] as const),
  dueDate: z.date(),
  startDate: z.date().optional(),
  dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '格式��为 HH:mm'),
  pomodoroEstimate: z.number().int().min(1, '至少1个番茄'),
});
type TaskFormData = z.infer<typeof taskSchema>;
export function NewTaskDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const addTask = useAppStore(s => s.addTask);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', priority: 3, type: 'other', dueDate: new Date(), startDate: new Date(), dueTime: '09:00', pomodoroEstimate: 1 },
  });
  const onSubmit = async (data: TaskFormData) => {
    try {
      await addTask({ ...data, priority: data.priority as Priority, dueDate: data.dueDate.toISOString(), startDate: data.startDate?.toISOString() });
      toast.success("法诀录入��功！");
      reset();
      setOpen(false);
    } catch (err) { toast.error("录入失败，请检查神识链接"); }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-5xl border-none shadow-2xl">
        <DialogHeader>
          <div className="bg-primary/10 h-12 w-12 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-display font-bold">研习新法诀</DialogTitle>
          <DialogDescription className="text-lg">规划你的修行进度，合理分配灵力。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="font-bold ml-1">法诀名��</Label>
            <Input {...register('title')} placeholder="如：九转元功第一层" className="rounded-2xl h-14 bg-secondary/50 border-none" />
            {errors.title && <p className="text-red-500 text-xs font-bold">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold ml-1">修行领域</Label>
              <Controller name="type" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="rounded-2xl h-14 bg-secondary/50 border-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="reading">藏经��� (阅读)</SelectItem>
                    <SelectItem value="listening">悟道台 (听力)</SelectItem>
                    <SelectItem value="writing">演武场 (创作)</SelectItem>
                    <SelectItem value="other">外务堂 (其���)</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="space-y-2">
              <Label className="font-bold ml-1">灵气属性 (优先级)</Label>
              <Controller name="priority" control={control} render={({ field }) => (
                <Select onValueChange={v => field.onChange(Number(v))} value={String(field.value)}>
                  <SelectTrigger className="rounded-2xl h-14 bg-secondary/50 border-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="1">烈火红 (P1-���急)</SelectItem>
                    <SelectItem value="2">流水蓝 (P2-重���)</SelectItem>
                    <SelectItem value="3">巨石灰 (P3-普通)</SelectItem>
                    <SelectItem value="4">清风绿 (P4-随意)</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold ml-1">圆满日期</Label>
              <Controller name="dueDate" control={control} render={({ field }) => (
                <Popover><PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start rounded-2xl h-14 bg-secondary/50 border-none">
                    <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : "选择日期"}
                  </Button>
                </PopoverTrigger><PopoverContent className="rounded-3xl p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
              )} />
            </div>
            <div className="space-y-2">
              <Label className="font-bold ml-1">预估耗费 (番茄)</Label>
              <Input type="number" {...register('pomodoroEstimate', { valueAsNumber: true })} className="rounded-2xl h-14 bg-secondary/50 border-none" />
            </div>
          </div>
          <DialogFooter><Button type="submit" className="w-full h-16 rounded-3xl text-xl font-bold shadow-xl shadow-primary/20">刻入识海</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}