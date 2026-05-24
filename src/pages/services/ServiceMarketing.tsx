import React from 'react';
import { ServicePage } from './ServiceLayout';

export default function ServiceMarketing() {
  return (
    <ServicePage
      title="Marketing Digital y Publicidad"
      metaTitle="Agencia de Marketing Digital y Publicidad en Santiago, Chile | PLANOZERO"
      metaDescription="Estrategia de marketing digital, campañas de Google Ads, Meta Ads y gestión de redes sociales. Agencia de marketing digital y publicidad en Santiago, Chile."
      canonical="https://www.planozero.cl/agencia-marketing-digital"
      schemaService="Servicio de Marketing Digital y Publicidad"
      tag="Marketing Digital · Publicidad · Santiago, Chile"
      heroBg="/service-marketing.jpg"
      headline={
        <>
          Marketing que<br />
          <span className="text-[#FF5F1F]">trae clientes reales</span>
        </>
      }
      subheadline="Estrategia digital y pauta publicitaria sin humo. Campañas que convierten porque están bien pensadas desde el principio, no porque tiramos presupuesto hasta que algo funciona."
      intro={
        <>
          <p>
            El problema del marketing digital no es la falta de herramientas. Es que la mayoría de las agencias venden visibilidad cuando lo que necesitas son clientes.
          </p>
          <p>
            Nosotros partimos del negocio, no del canal. Antes de hablar de redes sociales o Google Ads, entendemos qué se vende, a quién se le vende y por qué alguien elegiría ese producto sobre los demás. Desde ahí construimos la estrategia — y recién ahí elegimos los canales y la pauta.
          </p>
          <p>
            Trabajamos con presupuestos reales y plazos honestos. Cada peso invertido tiene que tener sentido. Si en tres meses no estamos moviendo las métricas que importan, lo decimos.
          </p>
        </>
      }
      points={[
        {
          title: 'Estrategia y Planificación',
          desc: 'Antes de activar cualquier canal, definimos objetivos medibles, segmentos de audiencia y el mensaje que conecta con cada uno. Sin esto, todo lo demás es ruido.'
        },
        {
          title: 'Google Ads',
          desc: 'Search, Display y YouTube. Capturamos demanda existente: gente que ya está buscando lo que vendes. Configuración, selección de palabras clave y seguimiento de conversiones real, no de clics.'
        },
        {
          title: 'Meta Ads (Facebook e Instagram)',
          desc: 'Campañas de generación de demanda para audiencias que aún no te conocen. Segmentación detallada, creatividades que funcionan y resultados más allá del engagement.'
        },
        {
          title: 'Gestión de Redes Sociales',
          desc: 'Contenido que tiene algo que decir. Calendario editorial, producción de piezas y gestión de comunidad — sin fórmulas genéricas ni contenido de relleno.'
        },
        {
          title: 'SEO y Posicionamiento Orgánico',
          desc: 'Optimización técnica, contenido que posiciona y construcción de autoridad. Para que te encuentren cuando alguien está buscando lo que vendes, sin pagar por cada clic.'
        },
        {
          title: 'Email Marketing y Automatización',
          desc: 'Secuencias de emails que nutren leads y convierten en el momento correcto. Se configuran una vez y trabajan solos.'
        },
        {
          title: 'Creatividad para Pauta',
          desc: 'Piezas diseñadas para funcionar como anuncios, no adaptadas de materiales de branding. Copy directo, formatos nativos por canal y A/B testing sistemático.'
        },
        {
          title: 'Analítica y Reportes',
          desc: 'Dashboards que muestran lo que importa. CAC, LTV, ROAS — los números que te dicen si el marketing está funcionando de verdad, sin reportes de 40 páginas que no dicen nada.'
        },
      ]}
      process={[
        {
          num: '01',
          title: 'Auditoría de estado actual',
          desc: 'Revisamos lo que ya existe: cuentas de ads, analítica, redes sociales, posicionamiento orgánico. Identificamos qué funciona, qué no, y dónde están las oportunidades reales.'
        },
        {
          num: '02',
          title: 'Estrategia y hoja de ruta',
          desc: 'Definimos los canales prioritarios, los mensajes por segmento y los objetivos del primer trimestre. Un plan con números reales, no proyecciones optimistas.'
        },
        {
          num: '03',
          title: 'Producción y activación',
          desc: 'Creamos los materiales, configuramos las cuentas y lanzamos. Los primeros 30 días son de aprendizaje — recopilamos datos para optimizar con base real.'
        },
        {
          num: '04',
          title: 'Optimización continua',
          desc: 'Semana a semana revisamos métricas y ajustamos. Lo que no funciona se pausa. Lo que funciona escala. Sin reuniones innecesarias.'
        },
        {
          num: '05',
          title: 'Reporte mensual',
          desc: 'Un informe claro con lo que pasó, lo que aprendimos y lo que haremos el mes siguiente. Presentado y explicado, nunca solo enviado por email.'
        },
      ]}
      faqs={[
        {
          q: '¿Cuánto presupuesto necesito para empezar?',
          a: 'Para campañas de pauta digital en Chile, recomendamos un mínimo de $300.000–500.000 CLP mensuales de inversión en medios, más el fee de gestión. Con menos no hay suficientes datos para optimizar bien. Somos directos con esto desde el principio.'
        },
        {
          q: '¿En cuánto tiempo se ven resultados?',
          a: 'Depende del canal. Con Google Ads o Meta Ads los primeros resultados se ven en semanas. Con SEO, los resultados orgánicos toman 3–6 meses de trabajo consistente. No prometemos resultados inmediatos en canales que no los tienen.'
        },
        {
          q: '¿Las cuentas de ads quedan a mi nombre?',
          a: 'Siempre. Las cuentas de Google Ads y Meta Ads son tuyas. Si en algún momento cambias de agencia, te llevas todo el historial y la configuración. Nunca trabajamos en cuentas propias para retener clientes.'
        },
        {
          q: '¿Trabajan con cualquier tipo de empresa?',
          a: 'Trabajamos mejor con empresas que tienen un producto claro, un ticket de venta razonable y disposición a compartir información de negocio. Si no sabemos qué margen tiene el producto, no podemos decirte si las campañas son rentables.'
        },
        {
          q: '¿Incluye la gestión de redes sociales?',
          a: 'Sí, si el cliente lo necesita. Gestión de contenido, pauta social y community management. Aunque siempre aclaramos algo: las redes no son el canal de ventas de todos los negocios. Si no es el canal correcto para el tuyo, lo decimos.'
        },
        {
          q: '¿Con cuánta anticipación hay que planificar una campaña de pauta?',
          a: 'Para una campaña con creatividades nuevas, necesitamos al menos dos semanas de anticipación. Para fechas clave como Cyber Monday o navidad, idealmente un mes. Campañas de urgencia se pueden activar más rápido, pero la calidad se resiente.'
        },
      ]}
      faqSchema={[
        { q: '¿Cuánto presupuesto necesito para marketing digital en Chile?', a: 'Recomendamos mínimo $300.000–500.000 CLP mensuales de inversión en medios para tener datos suficientes para optimizar.' },
        { q: '¿En cuánto tiempo se ven resultados de marketing digital?', a: 'Con pauta los resultados se ven en semanas. Con SEO toman 3–6 meses de trabajo consistente.' },
        { q: '¿Las cuentas de Google Ads quedan a mi nombre?', a: 'Siempre. Si cambias de agencia, te llevas todo el historial y la configuración.' },
        { q: '¿Incluye gestión de redes sociales?', a: 'Sí. Gestión de contenido, pauta social y community management, cuando corresponde al negocio.' },
      ]}
      relatedLinks={[
        { label: 'Agencia de Branding',   href: '/agencia-branding' },
        { label: 'Diseño UX/UI',          href: '/diseno-ux-ui' },
        { label: 'Diseño Web',            href: '/diseno-web' },
      ]}
    />
  );
}
