import React from 'react';
import { ServicePage } from './ServiceLayout';

export default function ServiceWeb() {
  return (
    <ServicePage
      title="Diseño Web"
      metaTitle="Agencia de Diseño Web en Santiago, Chile | PLANOZERO"
      metaDescription="Desarrollamos sitios web y plataformas digitales rápidas, bien construidas y fáciles de operar. Diseño web profesional en Santiago, Chile."
      canonical="https://www.planozero.cl/diseno-web"
      schemaService="Servicio de Diseño y Desarrollo Web"
      tag="Desarrollo Web · Santiago, Chile"
      headline={<>Sitios web que<br /><span className="text-[#FF5F1F]">duran en el tiempo</span></>}
      subheadline="Construimos lo que diseñamos. Sitios rápidos, código limpio y plataformas que el equipo puede operar sin depender de nosotros para cada cambio."
      intro={
        <>
          <p>
            Un sitio web mal construido es un pasivo. Lento, difícil de actualizar, costoso de mantener y casi siempre invisible para Google. Lo vemos seguido: empresas que pagaron bien por algo que se ve bien en la demo y tarda tres segundos en cargar en el celular.
          </p>
          <p>
            Nuestra forma de trabajar parte del diseño — del que tiene lógica — y termina en código que se puede mantener. No usamos constructores de página cuando no corresponde. No entregamos sitios que solo nosotros podemos tocar.
          </p>
          <p>
            Si en seis meses querés cambiar el copy del hero sin llamarnos, eso tiene que ser posible. Lo diseñamos para eso.
          </p>
        </>
      }
      points={[
        {
          title: 'Sitios Corporativos y Landing Pages',
          desc: 'Desde una landing de campaña hasta un sitio institucional completo. Diseñados para convertir, optimizados para carga rápida y construidos para posicionar.'
        },
        {
          title: 'E-commerce y Tiendas Online',
          desc: 'Plataformas de venta que funcionan. Shopify, WooCommerce o desarrollo a medida — según lo que necesite el volumen y operativa del negocio.'
        },
        {
          title: 'Optimización Core Web Vitals',
          desc: 'LCP, CLS, FID — las métricas que Google usa para rankear. Auditamos y optimizamos sitios existentes que carguen lento o tengan problemas técnicos de SEO.'
        },
        {
          title: 'CMS y Gestión de Contenido',
          desc: 'WordPress, Webflow o sistemas a medida. El cliente puede publicar contenido, actualizar precios y editar secciones sin tocar código.'
        },
        {
          title: 'Integraciones y Automatizaciones',
          desc: 'CRM, herramientas de marketing, pasarelas de pago, sistemas internos. Conectamos el sitio con el ecosistema digital del negocio.'
        },
        {
          title: 'Mantenimiento y Soporte',
          desc: 'Actualizaciones, backups, monitoreo de uptime y soporte técnico. Para que el sitio no sea un problema que aparece el fin de semana.'
        },
      ]}
      process={[
        {
          num: '01',
          title: 'Briefing técnico',
          desc: 'Entendemos el propósito del sitio, la audiencia, los flujos principales y las integraciones necesarias. Definimos el stack tecnológico antes de escribir una línea de código.'
        },
        {
          num: '02',
          title: 'Diseño UX/UI',
          desc: 'Wireframes, diseño visual y prototipo aprobado por el cliente antes de pasar al desarrollo. Sin sorpresas visuales a mitad del proyecto.'
        },
        {
          num: '03',
          title: 'Desarrollo',
          desc: 'Construimos sobre el diseño aprobado. Código limpio, responsive, optimizado para velocidad y listo para SEO técnico desde el inicio.'
        },
        {
          num: '04',
          title: 'QA y pruebas',
          desc: 'Testing en múltiples dispositivos y navegadores. Revisamos velocidad, formularios, integraciones y que todo funcione como debe antes de publicar.'
        },
        {
          num: '05',
          title: 'Lanzamiento y capacitación',
          desc: 'Publicamos el sitio y capacitamos al equipo en el CMS. Dejamos documentación de uso y estamos disponibles el primer mes para cualquier ajuste.'
        },
      ]}
      faqs={[
        {
          q: '¿Cuánto cuesta un sitio web en Chile?',
          a: 'Un landing page bien hecho parte en $800.000 - $1.500.000 CLP. Un sitio corporativo completo está entre $2.000.000 - $5.000.000 CLP según alcance. Un e-commerce con integraciones puede superar eso. Siempre damos presupuesto cerrado antes de empezar — sin cobros sorpresa.'
        },
        {
          q: '¿Cuánto tiempo tarda hacer un sitio?',
          a: 'Un landing page: 2-3 semanas. Un sitio corporativo: 4-8 semanas. Un e-commerce: 6-12 semanas. Los plazos dependen de qué tan rápido el cliente entrega contenido e hitos de aprobación. Eso siempre lo aclaramos al inicio.'
        },
        {
          q: '¿Puedo actualizar el contenido yo mismo?',
          a: 'Sí, y eso no es negociable para nosotros. Entregamos todos los proyectos con un CMS configurado y capacitación para el equipo. No queremos que dependas de nosotros para cambiar un texto.'
        },
        {
          q: '¿En qué tecnología trabajan?',
          a: 'Depende del proyecto. Para sitios de contenido, WordPress o Webflow. Para aplicaciones web complejas, React con backend a medida. Para e-commerce, Shopify o WooCommerce. Elegimos la herramienta correcta, no la que más nos conviene a nosotros.'
        },
        {
          q: '¿Incluyen hosting y dominio?',
          a: 'Podemos gestionar el hosting si el cliente lo prefiere, pero recomendamos que el dominio y la cuenta de hosting queden a nombre del cliente. Si en algún momento cambian de agencia, todo tiene que ser tuyo.'
        },
      ]}
      faqSchema={[
        { q: '¿Cuánto cuesta un sitio web en Chile?', a: 'Un landing page parte en $800.000-$1.500.000 CLP. Un sitio corporativo completo está entre $2.000.000-$5.000.000 CLP.' },
        { q: '¿Cuánto tiempo tarda hacer un sitio?', a: 'Un landing page: 2-3 semanas. Un sitio corporativo: 4-8 semanas. Un e-commerce: 6-12 semanas.' },
        { q: '¿Puedo actualizar el contenido yo mismo?', a: 'Sí. Entregamos todos los proyectos con CMS configurado y capacitación para el equipo.' },
      ]}
      relatedLinks={[
        { label: 'Diseño UX/UI', href: '/diseno-ux-ui' },
        { label: 'Agencia de Branding', href: '/agencia-branding' },
        { label: 'Marketing Digital', href: '/agencia-marketing-digital' },
      ]}
    />
  );
}
