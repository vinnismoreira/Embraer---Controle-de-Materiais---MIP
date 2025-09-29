import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Sua chave da SendGrid

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, subject, material } = req.body;

  if (!email || !subject || !material) {
    return res.status(400).json({ message: 'Campos faltando' });
  }

  const msg = {
    to: email,
    from: 'seuemail@dominio.com', // seu email verificado na SendGrid
    subject: subject,
    text: `Prezados (a),

Durante a verificação dos armários MIP, foi identificada a falta do seguinte material: ${material}.
Solicitamos, por gentileza, a reposição o mais breve possível para garantir a continuidade das atividades.

Atenciosamente,
MRO BRASIL
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao enviar email', error: err.message });
  }
}