FROM python:3.10-slim
WORKDIR /app
COPY ../common/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt
COPY main.py ./
EXPOSE 9003
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9003"]