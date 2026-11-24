# Dibuja los diagramas de los productos: docs/diagramas/gd-harness.svg (Galivelop Developer) y gve-evaluacion.svg
# (Galivelop Evaluator), cada uno con su versión del tema oscuro (<nombre>-oscuro.svg: fondo noche, nunca el papel claro).
# Uso: python3 scripts/diagramas/productos.py [carpeta]   (por defecto, docs/diagramas)
# y luego: node scripts/diagramas-webp.mjs gd-harness gd-harness-oscuro gve-evaluacion gve-evaluacion-oscuro
# Los textos van en castellano dentro del dibujo; los alt y pies en es, gl y en están en src/data/productos/<slug>.json.
import sys
# Colores por tema, de la tabla de tokens de docs/marca.md. Cada nombre es un papel en el dibujo, no un color:
#   PAPEL --papel · RET --reticula · SUP --superficie · SUP2 --superficie-2 (casillas) · FIL --filete · TINTA --tinta
#   T2 --tinta-2 · ALGA --alga · CEL --celeste · LINEA trazos, flechas y bordes de acento · ACENTO texto de acento
#   (--enlace en oscuro) · BLOQUE --celeste-hondo (bloques con texto blanco) · SOBRE texto sobre BLOQUE
#   SOBRE_TINTA / SOBRE_TINTA_2 texto sobre un bloque de tinta (en oscuro la tinta es clara y lleva texto oscuro)
#   ACENTO_TINTA acento sobre el bloque de tinta · SOBRE_CEL texto sobre --celeste (regla 10: solo tinta oscura).
TEMAS={
 'claro': dict(PAPEL='#fbfcfd',RET='#eef3f6',SUP='#ffffff',SUP2='#ffffff',FIL='#b9cbd6',TINTA='#13212b',T2='#4a5c69',
               ALGA='#5d7a6a',CEL='#1aa6df',LINEA='#0072a8',ACENTO='#0072a8',BLOQUE='#0072a8',SOBRE='#ffffff',
               SOBRE_TINTA='#ffffff',SOBRE_TINTA_2='#e6eef3',ACENTO_TINTA='#1aa6df',SOBRE_CEL='#13212b'),
 'oscuro': dict(PAPEL='#0d171e',RET='#121e27',SUP='#111f29',SUP2='#16242e',FIL='#2b3d49',TINTA='#e6eef3',T2='#9fb2bf',
               ALGA='#8fb09e',CEL='#1aa6df',LINEA='#1aa6df',ACENTO='#5cc8f2',BLOQUE='#0b5e88',SOBRE='#ffffff',
               SOBRE_TINTA='#0d171e',SOBRE_TINTA_2='#2b3d49',ACENTO_TINTA='#0072a8',SOBRE_CEL='#13212b'),
}
def tema(nombre):
    globals().update(TEMAS[nombre])
tema('claro')
def head(h, nota):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="{h}" viewBox="0 0 1600 {h}">
<!-- {nota} Hoja de estilos de docs/marca.md (papel, retícula de 24 px, tinta, celeste, chaflanes; sin círculos).
     Lo dibuja scripts/diagramas/productos.py (tema claro y oscuro): no se edita a mano.
     Se exporta con scripts/diagramas-webp.mjs a public/productos/<slug>/<nombre>.webp (1600) y -mini.webp (720).
     Fuentes: Big Shoulders Display (títulos), Literata (frases) y JetBrains Mono (datos), las de la web. -->
<defs>
  <pattern id="rejilla" width="24" height="24" patternUnits="userSpaceOnUse">
    <path d="M24 0H0V24" fill="none" stroke="{RET}" stroke-width="1"/>
  </pattern>
  <marker id="fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="{LINEA}"/></marker>
  <marker id="fk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="{TINTA}"/></marker>
  <marker id="fm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="{ALGA}"/></marker>
</defs>
<style>
  .t {{ font-family: 'Big Shoulders Display Variable', 'Big Shoulders Display', sans-serif; font-weight: 800; letter-spacing: 0.01em; }}
  .s {{ font-family: 'Literata Variable', Literata, serif; font-weight: 500; }}
  .m {{ font-family: 'JetBrains Mono Variable', 'JetBrains Mono', monospace; font-weight: 500; }}
  .b {{ font-weight: 700; }}
</style>
<rect width="1600" height="{h}" fill="{PAPEL}"/>
<rect width="1600" height="{h}" fill="url(#rejilla)"/>
'''
def box(x,y,w,h,c=14,fill=None,stroke=None,sw=2,extra=''):
    fill=fill or SUP; stroke=stroke or LINEA
    return f'<path d="M{x} {y}H{x+w-c}L{x+w} {y+c}V{y+h}H{x}Z" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{extra}/>\n'
def tx(x,y,s,cls,size,fill=None,anchor='start',extra=''):
    fill=fill or TINTA
    return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"{extra}>{s}</text>\n'
def line(d,stroke=None,sw=3,mk='fa',extra=''):
    stroke=stroke or LINEA
    m=f' marker-end="url(#{mk})"' if mk else ''
    return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}"{m}{extra}/>\n'
def cabecera(kicker,titulo,sub):
    return (tx(62,66,kicker,'m b',22,ACENTO,extra=' letter-spacing="0.08em"')+tx(60,132,titulo,'t',64)+tx(62,176,sub,'s',27,T2))
def ventajas(y,items):
    n=len(items); gap=24; w=(1480-gap*(n-1))/n; o=''
    for i,(a,b) in enumerate(items):
        x=round(60+i*(w+gap))
        o+=box(x,y,round(w),140,fill=BLOQUE,stroke=BLOQUE)
        o+=tx(x+26,y+62,a,'t',40,SOBRE)+tx(x+26,y+106,b,'s',24,SOBRE)
    return o

def developer():
    H=1050
    o=head(H,'Galivelop Developer: cómo funciona el harness local de punta a punta.')
    o+=cabecera('GALIVELOP DEVELOPER · HARNESS LOCAL','TU FLUJO DE TRABAJO, CON IA EN TU MÁQUINA','Agentes locales llevan el trabajo del proyecto. Tú decides qué entra.')
    # marco de la máquina
    o+=f'<path d="M60 262H1512L1540 290V826H60Z" fill="{CEL}" fill-opacity="0.07" stroke="{LINEA}" stroke-width="3"/>\n'
    o+=f'<path d="M60 210H346L360 224V262H60Z" fill="{BLOQUE}"/>\n'
    o+=tx(84,250,'TU MÁQUINA','t',38,SOBRE)
    o+=tx(388,246,'tu código y tus datos no salen de aquí','m',22,T2)
    o+=box(1180,206,360,44,c=10,fill=PAPEL,stroke=T2,sw=2,extra=' stroke-dasharray="7 6"')
    o+=tx(1360,236,'nube: opcional, por papel','m',20,T2,'middle')
    # carril del flujo
    o+=box(90,290,1420,84,stroke=ALGA,sw=2.5)
    o+=f'<path d="M112 306H142V311H112Z" fill="{ALGA}"/>\n'
    o+=tx(112,352,'EL FLUJO DEL TALLER MARCA EL TRABAJO','t',34)
    x=700
    for c in ['plan','tareas','límites','revisión','comprobaciones']:
        w=round(len(c)*13.3+30)
        o+=box(x,312,w,42,c=10,fill=ALGA,stroke=ALGA,sw=1.5,extra=' fill-opacity="0.1"')
        o+=tx(x+w/2,341,c,'m',22,TINTA,'middle'); x+=w+14
    # papeles
    xs=[90,456,822,1188]; W=322; Y=412; Hh=230
    roles=[('01','QUIEN ORGANIZA','Reparte la tarea','y fija los límites.'),('02','QUIEN HACE','Hace el cambio','en una copia aparte.'),('03','QUIEN REVISA','Pruebas y revisión','antes de integrar.')]
    for (n,t,a,b),x in zip(roles,xs):
        o+=line(f'M{x+W//2} 374V404',ALGA,2.5,'fm')
        o+=box(x,Y,W,Hh)
        o+=f'<path d="M{x} {Y+178}H{x+W}V{Y+Hh}H{x}Z" fill="{CEL}" fill-opacity="0.16" stroke="{LINEA}" stroke-width="2"/>\n'
        o+=tx(x+24,Y+40,n,'m b',22,ACENTO)
        o+=tx(x+24,Y+88,t,'t',42)
        o+=tx(x+24,Y+126,a,'s',25,T2)+tx(x+24,Y+158,b,'s',25,T2)
        o+=tx(x+24,Y+213,'MODELO LOCAL','m b',21,ACENTO,extra=' letter-spacing="0.06em"')
    x=xs[3]
    o+=box(x,Y,W,Hh,fill=TINTA,stroke=TINTA)
    o+=f'<path d="M{x} {Y+178}H{x+W}V{Y+Hh}H{x}Z" fill="{CEL}" stroke="{CEL}" stroke-width="2"/>\n'
    o+=tx(x+24,Y+40,'04','m b',22,ACENTO_TINTA)
    o+=tx(x+24,Y+88,'TÚ DECIDES','t',42,SOBRE_TINTA)
    o+=tx(x+24,Y+126,'Das el visto bueno','s',25,SOBRE_TINTA_2)+tx(x+24,Y+158,'y el cambio entra.','s',25,SOBRE_TINTA_2)
    o+=tx(x+24,Y+213,'LA ÚLTIMA PALABRA','m b',21,SOBRE_CEL,extra=' letter-spacing="0.06em"')
    # flechas entre papeles
    o+=line(f'M{xs[0]+W+3} 500H{xs[1]-7}')
    o+=line(f'M{xs[1]+W+3} 478H{xs[2]-7}')
    o+=line(f'M{xs[2]-3} 532H{xs[1]+W+7}',TINTA,3,'fk')
    o+=tx((xs[1]+W+xs[2])/2,570,'✗','m b',28,TINTA,'middle')
    o+=line(f'M{xs[2]+W+3} 500H{xs[3]-7}')
    # llave de los modelos
    o+=f'<path d="M90 654V664H1144V654" fill="none" stroke="{LINEA}" stroke-width="2"/>\n'
    o+=tx(617,698,'Cada papel, el modelo local que mejor rinde en tu equipo: medido, no a ojo.','s',25,TINTA,'middle')
    # tronco del proyecto
    o+=tx(90,756,'TU PROYECTO','m b',21,TINTA,extra=' letter-spacing="0.06em"')
    o+=tx(262,756,'la versión buena no se toca','m',21,T2)
    o+=line('M90 784H1500',TINTA,4,'fk')
    o+=f'<path d="M640 784C680 784 680 744 720 744H1240C1290 744 1300 784 1349 784" fill="none" stroke="{LINEA}" stroke-width="4" stroke-dasharray="10 7"/>\n'
    o+=tx(980,732,'copia aparte','m b',21,ACENTO,'middle')
    o+=line('M1349 642V768',None,3,'fa')
    # nodos del tronco: rombos (un cuadrado girado), nunca círculos
    o+=f'<path d="M629 784L640 773L651 784L640 795Z" fill="{PAPEL}" stroke="{TINTA}" stroke-width="3"/><path d="M1337 784L1349 772L1361 784L1349 796Z" fill="{LINEA}"/>\n'
    o+=tx(1372,762,'✓ entra','m b',22,ACENTO)
    o+=ventajas(860,[('PRIVADO','Tu código no sale de casa.'),('SIN FACTURA POR USO','Trabaja tu propio equipo.'),('CON MÉTODO','Plan, revisión y pruebas.'),('TÚ MANDAS','Nada entra sin tu sí.')])
    return o+'</svg>\n'

def gve():
    H=940
    o=head(H,'Galivelop Evaluator (GVE): cómo mide un cambio, antes y después, con evidencia.')
    o+=cabecera('GALIVELOP EVALUATOR · GVE','¿ESE CAMBIO MEJORA TU IA DE VERDAD?','Mide antes y después con las mismas preguntas. Enseña qué sube y qué baja.')
    def lista(x,y,t,items,stroke):
        s=box(x,y,340,200,stroke=stroke)+f'<path d="M{x+24} {y+20}H{x+54}V{y+25}H{x+24}Z" fill="{stroke}"/>\n'+tx(x+24,y+70,t,'t',38)
        for i,it in enumerate(items): s+=tx(x+24,y+108+i*32,it,'s',24,T2)
        return s
    o+=lista(60,230,'TU SISTEMA DE IA',['búsqueda en documentos','asistentes','modelos locales'],T2)
    o+=lista(60,490,'UN CAMBIO',['otro prompt','otro modelo','otra forma de buscar'],LINEA)
    o+=line('M230 430V490',T2,3,None)
    o+=f'<rect x="213" y="443" width="34" height="34" fill="{PAPEL}" stroke="{T2}" stroke-width="2.5"/><path d="M221 460H239M230 451V469" stroke="{TINTA}" stroke-width="3"/>\n'
    antes='✓✓✗✓✗✗✓✓'; desp='✓✓✓✓✗✓✗✓'
    def carril(y,t,sub,marcas,ref=None):
        x=470; s=box(x,y,500,200)
        s+=f'<path d="M{x} {y+150}H{x+500}V{y+200}H{x}Z" fill="{CEL}" fill-opacity="0.16" stroke="{LINEA}" stroke-width="2"/>\n'
        s+=tx(x+24,y+56,t,'t',42)+tx(x+476,y+54,sub,'s',25,T2,'end')
        for i,mk in enumerate(marcas):
            cx=x+24+i*58; fill=SUP2; st=FIL; col=T2
            if ref and ref[i]!=mk:
                fill,col=(BLOQUE,SOBRE) if mk=='✓' else (TINTA,SOBRE_TINTA); st=fill
            s+=f'<rect x="{cx}" y="{y+78}" width="46" height="46" fill="{fill}" stroke="{st}" stroke-width="2"/>\n'
            s+=tx(cx+23,y+111,mk,'m b',26,col,'middle')
        s+=tx(x+250,y+184,'GUARDADA CON SU CONFIGURACIÓN','m b',20,ACENTO,'middle',' letter-spacing="0.04em"')
        return s
    o+=carril(230,'ANTES','medida de partida',antes)
    o+=carril(490,'DESPUÉS','con el cambio',desp,antes)
    o+=tx(720,470,'↓  las mismas preguntas  ↓','m b',22,TINTA,'middle')
    o+=line('M403 330H462')
    o+=line('M403 590H462')
    x=1050
    o+=box(x,230,490,460,stroke=TINTA,sw=2.5)
    o+=tx(x+24,286,'EL INFORME','t',42)
    filas=[('↑',BLOQUE,SOBRE,'MEJORA','fallaba y ahora acierta','✗ → ✓'),('↓',TINTA,SOBRE_TINTA,'EMPEORA','acertaba y ahora falla','✓ → ✗'),('=',SUP,T2,'SIGUE IGUAL','sin cambios','')]
    for i,(sg,f,c,t,d,e) in enumerate(filas):
        y=316+i*100
        o+=f'<rect x="{x+24}" y="{y}" width="72" height="72" fill="{f}" stroke="{T2 if f==SUP else f}" stroke-width="2"/>\n'
        o+=tx(x+60,y+50,sg,'m b',38,c,'middle')
        o+=tx(x+116,y+34,t,'t',34)+tx(x+116,y+66,d,'s',24,T2)+tx(x+466,y+32,e,'m b',24,TINTA,'end')
    o+=f'<path d="M{x} 620H{x+490}V690H{x}Z" fill="{TINTA}"/>\n'
    o+=tx(x+24,668,'DECIDES CON EVIDENCIA','t',36,SOBRE_TINTA)
    o+=line('M973 330C1010 330 1005 400 1042 400')
    o+=line('M973 590C1010 590 1005 520 1042 520')
    o+=ventajas(750,[('MISMAS PREGUNTAS','Antes y después, sin trampas.'),('TODO GUARDADO','Con su configuración exacta.'),('SUBE Y BAJA','Qué mejora y qué empeora.'),('SE PUEDE REPETIR','Evidencia, no impresiones.')])
    return o+'</svg>\n'
d=sys.argv[1] if len(sys.argv)>1 else 'docs/diagramas'
for nombre,sufijo in (('claro',''),('oscuro','-oscuro')):
    tema(nombre)
    open(f'{d}/gd-harness{sufijo}.svg','w').write(developer())
    open(f'{d}/gve-evaluacion{sufijo}.svg','w').write(gve())
