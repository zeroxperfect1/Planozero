import React from 'react';
import { ServicePage } from './ServiceLayout';

export default function ServiceMarketing() {
  return (
    <ServicePage
      title="Marketing Digital"
      metaTitle="Agencia de Marketing Digital en Santiago, Chile | PLANOZERO"
      metaDescription="Estrategia de marketing digital sin humo. Campañas de performance, gestión de redes sociales y analítica avanzada para empresas en Santiago, Chile."
      canonical="https://www.planozero.cl/agencia-marketing-digital"
      schemaService="Servicio de Marketing Digital"
      tag="Marketing Digital · Santiago, Chile"
      headline={<>Marketing digital<br /><span className="text-[#FF5F1F]">sin promesas vacías</span></>}
      subheadline="Campañas que convierten porque están bien pensadas desde el principio. Nada de tirar presupuesto hasta que algo funcione." 
      intro={
        <>
          <p>
            El problema del marketing digital no es la falta de herramientas. Es que la mayoría de las agencias te venden visibilidad cuando lo que necesitás son clientes.
          </p>
          <p>
            Nosotros partimos del negocio, no del canal. Antes de hablar de redes sociales o Google Ads, entendemos qué vende, a quién le vende y por qué alguien elegiría tu producto sobre los demás. Desde ahí construimos la estrategia — y recién ahí elegimos los canales.
          </p>
          <p>
            Trabajamos con presupuestos reales y plazos honestos. Si en tres meses no estamos moviendo las métricas que importan, lo decimos.
          </p>
        </>
      }
      points={[
        {
          title: 'Estrategia y Planificación',
          desc: 'Antes de activar cualquier canal, definimos objetivos medibles, segmentos de audiencia y el mensaje que conecta con cada uno. Sin esto, todo lo demás es ruido.'
        },
        {
          title: 'Campañas de Performance',
          desc: 'Google Ads, Meta Ads y campañas de retargeting enfocadas en conversión, no en impresiones. Optimizamos en base a datos, no a intuición.'
        },
        {
          title: 'Gestión de Redes Sociales',
          desc: 'Contenido que tiene algo que decir. Calendario editorial, producción de piezas y gestión de comunidad — sin fórmulas genéricas ni contenido de relleno.'
        },
        {
          title: 'SEO y Posicionamiento',
          desc: 'Optimización técnica, contenido que posiciona y construcción de autoridad. Para que te encuentren cuando alguien está buscando lo que vendés.'
        },
        {
          title: 'Email Marketing y Automatización',
          desc: 'Secuencias de emails que nutren leads y convierten en el momento correcto. Configuramos los flujos una vez y trabajan solos.'
        },
        {
          title: 'Analítica y Reportes',
          desc: 'Dashboards que muestran lo que importa, no todo lo que puede medirse. CAC, LTV, ROAS — los números que te dicen si el marketing está funcionando de verdad.'
        },
      ]}
      process={[
        {
          num: '01',
          title: 'Auditoría de estado actual',
          desc: 'Revisamos lo que ya existe: cuentas de ads, analítica, redes sociales, posicionamiento orgánico. Identificamos qué funciona, qué no, y dónde están las oportunidades.'
        },
        {
          num: '02',
          title: 'Estrategia y hoja de ruta',
          desc: 'Definimos los canales prioritarios, los mensajes por segmento y los objetivos del primer trimestre. Presentamos un plan con números reales, no proyecciones aspiracionales.'
        },
        {
          num: '03',
          title: 'Activación de campañas',
          desc: 'Configuramos las cuentas, creamos los materiales y lanzamos. Los primeros 30 días son de aprendizaje — recopilamos datos para optimizar.'
        },
        {
          num: '04',
          title: 'Optimización continua',
          desc: 'Semana a semana revisamos métricas y ajustamos. Lo que no funciona se pausa. Lo que funciona escala. Sin reuniones innecesarias ni reportes de 40 páginas.'
        },
        {
          num: '05',
          title: 'Reporte mensual',
          desc: 'Un informe claro con lo que pasó, lo que aprendimos y lo que haremos el mes siguiente. Presentado en persona o por videollamada, nunca solo enviado por email.'
        },
      ]}
      faqs={[
        {
          q: '¿Cuánto presupuesto necesito para empezar?',
          a: 'Para campañas de pauta digital en Chile, recomendamos un mínimo de $300.000-500.000 CLP mensuales de inversión en medios, más el fee de gestión. Con menos presupuesto no hay suficientes datos para optimizar. Somos directos con esto desde el principio.'
        },
        {
          q: '¿En cuánto tiempo se ven resultados?',
          a: 'Depende del canal. Con Google Ads o Meta Ads los primeros resultados se ven en semanas. Con SEO, los resultados orgánicos toman 3-6 meses de trabajo consistente. No prometemos resultados inmediatos en canales que no los tienen.'
        },
        {
          q: '¿Trabajan con cualquier tipo de empresa?',
          a: 'Trabajamos mejor con empresas que tienen un producto claro, un ticket de venta razonable y disposición a compartir información de negocio. Si no sabemos qué margen tiene el producto, no podemos decirte si las campañas son rentables.'
        },
        {
          q: '¿Qué pasa con el presupuesto de pauta si terminamos el contrato?',
          a: 'Las cuentas de Google Ads y Meta Ads son tuyas. Si terminamos de trabajar juntos, te las entregamos con toda la configuración e historial. Nunca trabajamos en cuentas propias para retener clientes.'
        },
        {
          q: '¿Manejan redes sociales también?',
          a: 'Sí. Gestión de contenido, pauta social y community management. Pero siempre aclaramos algo: las redes no son el canal de ventas de todos los negocios. Si no es el canal correcto para el tuyo, lo decimos.'
        },
      ]}
      faqSchema={[
        { q: '¿Cuánto presupuesto necesito para empezar?', a: 'Para campañas en Chile recomendamos un mínimo de $300.000-500.000 CLP mensuales de inversión en medios.' },
        { q: '¿En cuánto tiempo se ven resultados?', a: 'Con pauta los resultados se ven en semanas. Con SEO toman 3-6 meses de trabajo consistente.' },
        { q: '¿Qué pasa con el presupuesto de pauta si terminamos el contrato?', a: 'Las cuentas de Google Ads y Meta Ads son tuyas. Se entregan con toda la configuración e historial.' },
      ]}
      relatedLinks={[
        { label: 'Agencia de Publicidad', href: '/agencia-publicidad' },
        { label: 'Diseño UX/UI', href: '/diseno-ux-ui' },
        { label: 'Diseño Web', href: '/diseno-web' },
      ]}
    />
  );
}
