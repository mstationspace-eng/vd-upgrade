import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MessageSquare, X } from 'lucide-react';

const createContactSchema = (t: (key: string) => string) => z.object({
  firstName: z.string().min(1, t('required')),
  lastName: z.string().min(1, t('required')),
  email: z.string().email(t('invalidEmail')),
  phone: z.string().min(1, t('required')),
  company: z.string().optional(),
  subject: z.string().min(1, t('required')),
  message: z.string().min(1, t('required')),
});

export const ContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const contactSchema = createContactSchema(t);
  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submitted:', data);
      
      toast({
        title: t('formSubmitted'),
        description: t('formSubmitted'),
      });
      
      reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-card/80 backdrop-blur-md border-border/50 hover:bg-card/90"
        >
          <MessageSquare className="w-4 h-4" />
          {t('contactUs')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {t('contactUs')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('firstName')}</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder={t('firstNamePlaceholder')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('lastName')}</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder={t('lastNamePlaceholder')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder={t('emailPlaceholder')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t('phone')}
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder={t('phonePlaceholder')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">{t('company')}</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder={t('companyPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t('subject')}</Label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder={t('subjectPlaceholder')}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('message')}</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder={t('messagePlaceholder')}
              className="min-h-[100px]"
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {t('close')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? '...' : t('submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};