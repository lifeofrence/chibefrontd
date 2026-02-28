// components/admin/booking-email-dialog-template.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

import { sendEmailToGuest } from '@/app/admin/bookings/send-email-action';

interface BookingEmailDialogProps {
    selectedBooking: {
        id: number;
        guest_name: string;
        guest_email: string;
    } | null;
    onSent?: () => void;
}

export default function BookingEmailDialog({ selectedBooking, onSent }: BookingEmailDialogProps) {
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    const handleSendEmail = async () => {
        if (!selectedBooking) return;
        setSendingEmail(true);
        const result = await sendEmailToGuest(selectedBooking.id, emailSubject, emailMessage);
        setSendingEmail(false);
        if (result.success) {
            setEmailSubject('');
            setEmailMessage('');
            setIsEmailOpen(false);
            if (onSent) onSent();
        } else {
            console.error('Failed to send email:', result.message);
        }
    };

    return (
        <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Send Email to Guest</DialogTitle>
                    <DialogDescription>
                        Send an email to {selectedBooking?.guest_name} ({selectedBooking?.guest_email})
                    </DialogDescription>
                </DialogHeader>

                {/* form fields */}
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="Email subject"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            placeholder="Email message..."
                            rows={10}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEmailOpen(false)} disabled={sendingEmail}>
                        Cancel
                    </Button>
                    <Button onClick={handleSendEmail} disabled={sendingEmail}>
                        {sendingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Email
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}